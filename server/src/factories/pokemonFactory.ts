import { STAT_NAMES } from "../../../shared/constants/constants.js";
import { Pokemon, PokemonStats, Sprites } from "../../../shared/types/types.js";
/**
 * Factory function that creates a Pokemon instance from a raw PokeAPI response.
 * @param apiPokemonData - The raw Pokémon data from the API.
 * @returns {Pokemon} An instance of the Pokemon class.
 */
export function createPokemonFromApiData(pokemonApiData: any): Pokemon {
    const id = pokemonApiData.id;
    const name = pokemonApiData.name;
    const types = pokemonApiData.types.map(
        (type: { type: { name: string } }) => type.type.name
    );
    const sprites: Sprites = {
        officialArtwork:
            pokemonApiData.sprites.other["official-artwork"].front_default,
        back_default: pokemonApiData.sprites.back_default,
    };

    const stats: PokemonStats = pokemonApiData.stats.reduce(
        (acc: any, stat: { stat: { name: string }; base_stat: number }) => {
            if (stat.stat.name === "special-defense") {
                acc[STAT_NAMES.SPECIAL_DEFENSE] = stat.base_stat;
            } else if (stat.stat.name === "special-attack") {
                acc[STAT_NAMES.SPECIAL_ATTACK] = stat.base_stat;
            } else {
                acc[stat.stat.name as STAT_NAMES] = stat.base_stat;
            }
            return acc;
        },
        { weight: pokemonApiData.weight, height: pokemonApiData.height }
    );

    const pokemon: Pokemon = {
        id: id,
        name: name,
        types: types,
        sprites: sprites,
        stats: stats,
    };

    return pokemon;
}
