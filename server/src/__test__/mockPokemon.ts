import { Pokemon } from "../../../shared/types/types.js";

export function createMockPokemon(overrides = {}): Pokemon {
    return {
        id: 1,
        name: "bulbasaur",
        types: ["grass", "poison"],
        sprites: {
            back_default: "url",
            officialArtwork: "url",
        },
        stats: {
            hp: 45,
            attack: 49,
            defense: 49,
            specialAttack: 65,
            specialDefense: 65,
            speed: 45,
            height: 7,
            weight: 69,
        },
        ...overrides,
    } as Pokemon;
}
