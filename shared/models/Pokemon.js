/**
 *  Represents a Pokémon entity with its core properties for use on both client and server.
 *  Encapsulates the Pokémon's id, name, types, sprite URLs, and stats.
 *  Used for consistent data transfer and representation across the application.
 */

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
