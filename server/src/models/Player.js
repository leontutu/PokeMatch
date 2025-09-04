/**
 * Represents a player in a game session.
 * Holds the player's state, including their name, points, and current Pokémon.
 */
export default class Player {
    /**
     * @param {string} name The player's chosen name.
     * @param {string} uuid The player's persistent unique identifier.
     */
    constructor(name, uuid) {
        this.name = name;
        this.uuid = uuid;
        this.points = 0;
        this.pokemon = null;
        this.selectedStat = { name: null, value: null };
    }

    /**
     * Increments the player's points by one.
     */
    addPoint() {
        this.points += 1;
    }

    /**
     * Assigns a Pokémon to the player.
     * @param {object} pokemon The Pokémon object.
     */
    setPokemon(pokemon) {
        this.pokemon = pokemon;
    }

    /**
     * Sets the player's selected stat for the current round.
     * @param {string} statName The name of the selected stat.
     * @param {number} statValue The value of the selected stat.
     */
    setSelectedStat(statName, statValue) {
        this.selectedStat = { name: statName, value: statValue };
    }

    /**
     * Resets the player's selected stat to its initial state.
     */
    resetSelectedStat() {
        this.selectedStat = { name: null, value: null };
    }

    /**
     * Returns a JSON representation of the player.
     * @returns {object} The player data.
     */
    toJSON() {
        return {
            name: this.name,
            uuid: this.uuid,
            points: this.points,
            pokemon: this.pokemon,
            selectedStat: this.selectedStat,
        };
    }
}
