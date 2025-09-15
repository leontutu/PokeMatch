import Pokemon from "../../../shared/models/Pokemon.js";
/**
 * Factory function that creates a Pokemon instance from a raw PokeAPI response.
 * @param {Object} apiPokemonData - The raw Pokémon data from the API.
 * @returns {Pokemon} An instance of the Pokemon class.
 */
export function createPokemonFromApiData(pokemonApiData: any): Pokemon {
    const id = pokemonApiData.id;
    const name = pokemonApiData.name;
    const types = pokemonApiData.types.map(
        (type: { type: { name: string } }) => type.type.name
    );
    const sprites = {
        officialArtwork:
            pokemonApiData.sprites.other["official-artwork"].front_default,
        back_default: pokemonApiData.sprites.back_default,
    };
    const stats = pokemonApiData.stats.reduce(
        (acc: any, stat: { stat: { name: string }; base_stat: number }) => {
            // TODO: type
            if (stat.stat.name === "special-defense") {
                acc["specialDefense"] = stat.base_stat;
            } else if (stat.stat.name === "special-attack") {
                acc["specialAttack"] = stat.base_stat;
            } else {
                acc[stat.stat.name] = stat.base_stat;
            }
            return acc;
        },
        { weight: pokemonApiData.weight, height: pokemonApiData.height }
    );

    return new Pokemon(id, name, types, sprites, stats);
}
