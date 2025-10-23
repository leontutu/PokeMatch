import { beforeEach, describe, expect, test, vi } from "vitest";
import { createMockSocketContext } from "../../../__tests__/mocks/mockContexts";
import { createMockViewRoom } from "../../../__tests__/mocks/mockViewRoom";
import { render, screen } from "@testing-library/react";
import { Pages } from "../../../constants/constants";

let { mockPlay, mockStop } = vi.hoisted(() => {
    return { mockPlay: vi.fn(), mockStop: vi.fn() };
});

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

vi.mock("../../../contexts/UIInfoContext", () => ({
    useUIInfoContext: () => ({
        useUIInfoContext: vi.fn(),
    }),
}));

vi.mock("use-sound", () => ({
    useSound: () => [mockPlay, { sound: null, stop: mockStop }, mockStop],
}));

import PokemonRevealPage from "./PokemonRevealPage";

describe("PokemonRevealPage", () => {
    beforeEach(() => {
        vi.restoreAllMocks();

        mockSocketContext = createMockSocketContext();
        mockSocketContext.viewRoom = createMockViewRoom();
    });

    test("renders pokemon name and image when data is available", () => {
        render(<PokemonRevealPage />);
        const pokemon = mockSocketContext.viewRoom!.viewGame!.you.pokemon;
        expect(screen.getByAltText(pokemon.name)).toBeInTheDocument();
        expect(screen.getByText(pokemon.name, { exact: false })).toBeInTheDocument();
    });

    test("returns null when pokemon data is missing", () => {
        mockSocketContext.viewRoom = null;

        const { container } = render(<PokemonRevealPage />);

        expect(container.firstChild).toBeNull();
    });

    test("plays wiggle sound on mount when not wiping in", () => {
        render(<PokemonRevealPage />);

        expect(mockPlay).toHaveBeenCalled();
    });

    test("stops sounds on unmount", () => {
        const { unmount } = render(<PokemonRevealPage />);

        unmount();

        expect(mockStop).toHaveBeenCalled();
    });
});
