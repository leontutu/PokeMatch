import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { createMockSocketContext } from "../../../__tests__/mocks/mockContexts";
import { createMockViewRoom } from "../../../__tests__/mocks/mockViewRoom";
import { Pages } from "../../../constants/constants";
import PokemonRevealPage from "./PokemonRevealPage";

const { mockPlayPokeballWiggle, mockStopPokeballWiggle, mockPlayPokeballPoof, mockPlayPokemonCry } =
    vi.hoisted(() => {
        return {
            mockPlayPokeballWiggle: vi.fn(),
            mockStopPokeballWiggle: vi.fn(),
            mockPlayPokeballPoof: vi.fn(),
            mockPlayPokemonCry: vi.fn(),
        };
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

vi.mock("../../../stores/useAudioStore", () => ({
    useAudioStore: (selector: (state: any) => any) =>
        selector({
            playPokeballWiggle: mockPlayPokeballWiggle,
            stopPokeballWiggle: mockStopPokeballWiggle,
            playPokeballPoof: mockPlayPokeballPoof,
            playPokemonCry: mockPlayPokemonCry,
        }),
}));

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

        expect(mockPlayPokeballWiggle).toHaveBeenCalled();
    });

    test("stops sounds on unmount", () => {
        const { unmount } = render(<PokemonRevealPage />);

        unmount();

        expect(mockStopPokeballWiggle).toHaveBeenCalled();
    });
});
