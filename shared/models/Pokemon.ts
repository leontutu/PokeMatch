/**
 *  Represents a Pokémon entity with its core properties for use on both client and server.
 *  Encapsulates the Pokémon's id, name, types, sprite URLs, and stats.
 *  Used for consistent data transfer and representation across the application.
 */

export default class Pokemon {
    // TODO: Refac to type alias for sprites and stats
    /**
     * @param {number} id
     * @param {string} name
     * @param {string[]} types
     * @param {object} stats
     * @param {object} sprites
     * @param {string} sprites.officialArtwork
     * @param {string} sprites.back_default
     * @param {object} stats
     */
    constructor(
        public id: number,
        public name: string,
        public types: string[],
        public sprites: object,
        public stats: object
    ) {}
}
