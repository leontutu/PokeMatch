/**
 * Parses a raw Pokémon API response object into a simplified Pokémon object.
 * @param {Object} pokemon - The raw Pokémon data from the API.
 * @returns {Object} Parsed Pokémon object with id, name, types, sprites, and stats.
 */
export function parsePokemon(pokemon) {
    return {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map((type) => type.type.name),
        sprites: {
            officialArtwork:
                pokemon.sprites.other["official-artwork"].front_default,
            back_default: pokemon.sprites.back_default,
        },
        stats: pokemon.stats.reduce(
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
            { weight: pokemon.weight, height: pokemon.height }
        ),
    };
}
