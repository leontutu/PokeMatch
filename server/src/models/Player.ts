import Pokemon from "../../../shared/types/types.js";

/**
 * Represents a player in a game session.
 * Holds the player's state, including their name, points, and current Pokémon.
 */
export default class Player {
    points: number;
    pokemon: Pokemon | null;
    selectedStat: { name: string | null; value: number | null }; // TODO: Refac to type alias
    /**
     * @param {string} name The player's chosen name.
     * @param {string} uuid The player's persistent unique identifier.
     */
    constructor(public name: string, public uuid: string) {
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
    setPokemon(pokemon: Pokemon) {
        this.pokemon = pokemon;
    }

    /**
     * Sets the player's selected stat for the current round.
     * @param {string} statName The name of the selected stat.
     * @param {number} statValue The value of the selected stat.
     */
    setSelectedStat(statName: string, statValue: number) {
        this.selectedStat = { name: statName, value: statValue }; //TODO use type alias?
    }

    /**
     * Resets the player's selected stat to its initial state.
     */
    resetSelectedStat() {
        this.selectedStat = { name: null, value: null }; // TODO use type alias?
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
