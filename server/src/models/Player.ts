import { PlayerInGameId, Pokemon, Stat } from "../../../shared/types/types.js";

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
    constructor(public name: string, public uuid: string, public inGameId: PlayerInGameId) {
        this.points = 0;
        this.pokemon = null;
        this.selectedStat = null;
    }

    /**
     * Increments the player's points by a specified amount.
     * @param points The number of points to add.
     */
    addPoints(points: number) {
        this.points += points;
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
}
