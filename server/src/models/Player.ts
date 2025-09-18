import { Pokemon, Stat } from "../../../shared/types/types.js";

/**
 * Represents a player in a game session.
 * Holds the player's state, including their name, points, and current Pokémon.
 */
export default class Player {
    points: number;
    pokemon: Pokemon | null;
    selectedStat: Stat | null;
    /**
     * @param name The player's chosen name.
     * @param uuid The player's persistent unique identifier.
     */
    constructor(public name: string, public uuid: string) {
        this.points = 0;
        this.pokemon = null;
        this.selectedStat = null;
    }

    /**
     * Increments the player's points by one.
     */
    addPoint() {
        this.points += 1;
    }

    /**
     * Assigns a Pokémon to the player.
     * @param pokemon The Pokémon object.
     */
    setPokemon(pokemon: Pokemon) {
        this.pokemon = pokemon;
    }

    /**
     * Sets the player's selected stat for the current round.
     * @param stat The selected stat
     */
    setSelectedStat(stat: Stat) {
        this.selectedStat = stat;
    }

    /**
     * Resets the player's selected stat to its initial state.
     */
    resetSelectedStat() {
        this.selectedStat = null;
    }

    /**
     * Returns a JSON representation of the player.
     * @returns The player data.
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
