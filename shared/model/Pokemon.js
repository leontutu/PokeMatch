export default class Pokemon {
    /**
     * @param {number} id
     * @param {string} name
     * @param {string[]} types
     * @param {object} sprites
     * @param {string} sprites.officialArtwork
     * @param {string} sprites.back_default
     * @param {object} stats
     */
    constructor(id, name, types, sprites, stats) {
        this.id = id;
        this.name = name;
        this.types = types;
        this.sprites = sprites;
        this.stats = stats;
    }
}

// return {
//     id: pokemon.id,
//     name: pokemon.name,
//     types: pokemon.types.map((type) => type.type.name),
//     sprites: {
//         officialArtwork:
//             pokemon.sprites.other["official-artwork"].front_default,
//         back_default: pokemon.sprites.back_default,
//     },
//     stats: pokemon.stats.reduce(
//         (acc, stat) => {
//             if (stat.stat.name === "special-defense") {
//                 acc["specialDefense"] = stat.base_stat;
//             } else if (stat.stat.name === "special-attack") {
//                 acc["specialAttack"] = stat.base_stat;
//             } else {
//                 acc[stat.stat.name] = stat.base_stat;
//             }
//             return acc;
//         },
//         { weight: pokemon.weight, height: pokemon.height }
//     ),
// };
