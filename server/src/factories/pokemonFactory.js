import { Pokemon } from "../../../shared/models/Pokemon.js";
/**
 * Factory function that creates a Pokemon instance from a raw PokeAPI response.
 * @param {Object} apiPokemon - The raw Pokémon data from the API.
 * @returns {Pokemon} An instance of the Pokemon class.
 */
export function createPokemonFromApiData(pokemonApiData) {
    const id = apiPokemon.id;
    const name = apiPokemon.name;
    const types = apiPokemon.types.map((type) => type.type.name);
    const sprites = {
        officialArtwork:
            apiPokemon.sprites.other["official-artwork"].front_default,
        back_default: apiPokemon.sprites.back_default,
    };
    const stats = apiPokemon.stats.reduce(
        (acc, stat) => {
            if (stat.stat.name === "special-defense") {
                acc["specialDefense"] = stat.base_stat;
            } else if (stat.stat.name === "special-attack") {
                acc["specialAttack"] = stat.base_stat;
            } else {
                acc[stat.stat.name] = stat.base_stat;
            }
            return acc;
        },
        { weight: apiPokemon.weight, height: apiPokemon.height }
    );

    return new Pokemon(id, name, types, sprites, stats);
}
