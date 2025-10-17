import { createPokemonFromApiData } from "./pokemonFactory.js";
import { StatNames } from "../../../shared/constants/constants.js";
import { test, expect } from "vitest";

test("createPokemonFromApiData maps basic pokemon properties correctly", () => {
    const pokemon = createPokemonFromApiData(mockPokemonApiData);
    expect(pokemon.id).toBe(mockPokemonApiData.id);
    expect(pokemon.name).toBe(mockPokemonApiData.name);
});

test("createPokemonFromApiData maps single type correctly", () => {
    const singleTypeMock = {
        ...mockPokemonApiData,
        types: [{ slot: 1, type: { name: "fire", url: "..." } }],
    };

    const pokemon = createPokemonFromApiData(singleTypeMock);

    expect(pokemon.types).toHaveLength(1);
    expect(pokemon.types[0]).toBe(singleTypeMock.types[0].type.name);
});

test("createPokemonFromApiData maps dual types correctly", () => {
    const pokemon = createPokemonFromApiData(mockPokemonApiData);

    expect(pokemon.types).toHaveLength(2);
    expect(pokemon.types[0]).toBe(mockPokemonApiData.types[0].type.name);
    expect(pokemon.types[1]).toBe(mockPokemonApiData.types[1].type.name);
});

test("createPokemonFromApiData maps stats correctly", () => {
    const pokemon = createPokemonFromApiData(mockPokemonApiData);
    expect(pokemon.stats.weight).toBe(mockPokemonApiData.weight);
    expect(pokemon.stats.height).toBe(mockPokemonApiData.height);
    for (const stat of mockPokemonApiData.stats) {
        const value = stat.base_stat;
        let name = stat.stat.name;
        if (name === "special-defense") {
            name = StatNames.SPECIAL_DEFENSE;
        } else if (name === "special-attack") {
            name = StatNames.SPECIAL_ATTACK;
        }
        expect(pokemon.stats[name as StatNames]).toBe(value);
    }
});

test("createPokemonFromApiData maps sprite URLs correctly", () => {
    const pokemon = createPokemonFromApiData(mockPokemonApiData);
    expect(pokemon.sprites.back_default).toBe(mockPokemonApiData.sprites.back_default);
    expect(pokemon.sprites.officialArtwork).toBe(
        mockPokemonApiData.sprites.other["official-artwork"].front_default
    );
});

const mockPokemonApiData = {
    id: 1,
    name: `bulbasaur`,
    height: 7,
    weight: 69,
    types: [
        {
            slot: 1,
            type: {
                name: "grass",
                url: "https://pokeapi.co/api/v2/type/12/",
            },
        },
        {
            slot: 2,
            type: {
                name: "poison",
                url: "https://pokeapi.co/api/v2/type/4/",
            },
        },
    ],
    stats: [
        {
            base_stat: 45,
            effort: 0,
            stat: {
                name: "hp",
                url: "https://pokeapi.co/api/v2/stat/1/",
            },
        },
        {
            base_stat: 49,
            effort: 0,
            stat: {
                name: "attack",
                url: "https://pokeapi.co/api/v2/stat/2/",
            },
        },
        {
            base_stat: 49,
            effort: 0,
            stat: {
                name: "defense",
                url: "https://pokeapi.co/api/v2/stat/3/",
            },
        },
        {
            base_stat: 65,
            effort: 1,
            stat: {
                name: "special-attack",
                url: "https://pokeapi.co/api/v2/stat/4/",
            },
        },
        {
            base_stat: 65,
            effort: 0,
            stat: {
                name: "special-defense",
                url: "https://pokeapi.co/api/v2/stat/5/",
            },
        },
        {
            base_stat: 45,
            effort: 0,
            stat: {
                name: "speed",
                url: "https://pokeapi.co/api/v2/stat/6/",
            },
        },
    ],
    sprites: {
        back_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png",
        other: {
            "official-artwork": {
                front_default:
                    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
            },
        },
    },
};
