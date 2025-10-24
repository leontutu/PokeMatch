import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMockSocketContext } from "../../../__tests__/mocks/mockContexts";
import { createMockViewRoom } from "../../../__tests__/mocks/mockViewRoom";
import { StatNames } from "../../../../../shared/constants/constants";
import { Pages, StatToDisplay } from "../../../constants/constants";
import { Pokemon, ViewGame } from "../../../../../shared/types/types";
import { UI_TEXT } from "../../../constants/uiText";

let mockSocketContext = createMockSocketContext();
const mockNavigate = vi.fn();
vi.mock("../../../contexts/SocketContext", () => ({
    useSocketContext: () => mockSocketContext,
}));

vi.mock("../../../contexts/NavigationContext", () => ({
    useNavigationContext: () => ({
        handleNavigate: mockNavigate,
        currentPage: Pages.SELECT_STAT,
    }),
}));

import SelectStatPage from "./SelectStatPage";

describe("SelectStatPage", () => {
    let viewGame: ViewGame;
    let pokemon: Pokemon;
    beforeEach(() => {
        vi.restoreAllMocks();

        mockSocketContext = createMockSocketContext();
        mockSocketContext.viewRoom = createMockViewRoom();
        viewGame = mockSocketContext.viewRoom.viewGame!;
        pokemon = viewGame.you.pokemon;
    });

    test("renders all stat cards with correct values", () => {
        render(<SelectStatPage />);
        expect(screen.getByText(StatToDisplay.get(StatNames.HP)!)).toBeInTheDocument();
        expect(screen.getByText(StatToDisplay.get(StatNames.ATTACK)!)).toBeInTheDocument();
        expect(screen.getByText(StatToDisplay.get(StatNames.DEFENSE)!)).toBeInTheDocument();
        expect(screen.getByText(StatToDisplay.get(StatNames.SPECIAL_ATTACK)!)).toBeInTheDocument();
        expect(screen.getByText(StatToDisplay.get(StatNames.SPECIAL_DEFENSE)!)).toBeInTheDocument();
        expect(screen.getByText(StatToDisplay.get(StatNames.SPEED)!)).toBeInTheDocument();
        expect(screen.getByText(StatToDisplay.get(StatNames.WEIGHT)!)).toBeInTheDocument();
        expect(screen.getByText(StatToDisplay.get(StatNames.HEIGHT)!)).toBeInTheDocument();

        expect(screen.getAllByText(viewGame.you.pokemon.stats.hp).length).toBeGreaterThan(0);
        expect(screen.getAllByText(viewGame.you.pokemon.stats.defense).length).toBeGreaterThan(0);
        expect(screen.getAllByText(viewGame.you.pokemon.stats.specialAttack).length).toBeGreaterThan(0);
        expect(screen.getAllByText(viewGame.you.pokemon.stats.specialDefense).length).toBeGreaterThan(0);
        expect(screen.getAllByText(viewGame.you.pokemon.stats.speed).length).toBeGreaterThan(0);
        expect(
            screen.getAllByText(viewGame.you.pokemon.stats.weight / 10 + " kg").length
        ).toBeGreaterThan(0);
        expect(screen.getAllByText(viewGame.you.pokemon.stats.height + " dm").length).toBeGreaterThan(0);
    });

    test("renders pokemon name and types", () => {
        render(<SelectStatPage />);

        expect(screen.getByText(pokemon.name.toUpperCase())).toBeInTheDocument();
        expect(screen.getByText(pokemon.types[0].toLowerCase())).toBeInTheDocument();
        expect(screen.getByText(pokemon.types[1].toLowerCase())).toBeInTheDocument();
    });

    test("clicking an unlocked stat card selects it", async () => {
        const user = userEvent.setup();
        render(<SelectStatPage />);

        const displayName = StatToDisplay.get(StatNames.ATTACK)!;
        const attackCard = screen.getByTestId(`stat-card-${displayName}`);
        await user.click(attackCard);
        expect(attackCard).toHaveClass(/highlight/);
    });

    test("clicking Choose button after selection sends stat to server", async () => {
        const user = userEvent.setup();
        render(<SelectStatPage />);

        const displayName = StatToDisplay.get(StatNames.ATTACK)!;
        const attackCard = screen.getByTestId(`stat-card-${displayName}`);
        await user.click(attackCard);

        const chooseButton = screen.getByRole("button", { name: new RegExp(UI_TEXT.BUTTONS.CHOOSE) });
        await user.click(chooseButton);

        expect(mockSocketContext.sendSelectStat).toHaveBeenCalledWith(displayName);
    });

    test("locked stat cards cannot be clicked", async () => {
        const user = userEvent.setup();
        mockSocketContext.viewRoom!.viewGame!.lockedStats = [StatNames.ATTACK];

        render(<SelectStatPage />);

        const displayName = StatToDisplay.get(StatNames.ATTACK)!;
        const attackCard = screen.getByTestId(`stat-card-${displayName}`);
        await user.click(attackCard);

        expect(attackCard).toHaveClass(/locked/);

        expect(attackCard).not.toHaveClass(/highlight/);

        const chooseButton = screen.getByRole("button", { name: new RegExp(UI_TEXT.BUTTONS.CHOOSE) });
        await user.click(chooseButton);

        expect(mockSocketContext.sendSelectStat).not.toHaveBeenCalled();
    });

    test("handles error signal from context", () => {
        mockSocketContext.selectStatErrorSignal = true;
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
        render(<SelectStatPage />);
        expect(alertSpy).toHaveBeenCalledTimes(1);
        expect(alertSpy).toHaveBeenCalledWith(UI_TEXT.ALERTS.STAT_ALREADY_LOCKED);
    });

    test("displays opponent pokemon image", () => {
        render(<SelectStatPage />);
        const opponentImage = screen.getByRole("img", { name: UI_TEXT.ALT_TEXT.OPPONENT_POKEMON });
        expect(opponentImage).toBeDefined();
        expect(opponentImage).toHaveAttribute("src", "charmanderUrl");
    });

    test("renders correct number of type badges", () => {
        render(<SelectStatPage />);
        const typeElements = screen.getAllByText(/grass|poison/i);
        expect(typeElements.length).toBeGreaterThanOrEqual(2);
    });

    test("does not render when viewGame is null", () => {
        mockSocketContext.viewRoom!.viewGame = null;
        const { container } = render(<SelectStatPage />);
        expect(container.firstChild).toBeNull();
    });
});
