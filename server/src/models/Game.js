import logger from "../utils/Logger.js";
import Player from "./Player.js";
import { GAME_PHASES } from "../../../shared/constants/constants.js";
import { GAME_EVENTS, GAME_COMMANDS } from "../constants/constants.js";
import { EventEmitter } from "events";
import GameToOrchestratorCommand from "../commands/GameToOrchestratorCommand.js";

/**
 * Represents the core game logic for a single match.
 * Manages players, game phases, battle rounds, and scoring.
 * Emits events to the Orchestrator to signal state changes.
 */
export default class Game extends EventEmitter {
    constructor(participants) {
        super();
        this.players = participants.map((p) => new Player(p.name, p.uuid));
        this.phase = GAME_PHASES.SELECT_STAT;
        this.lockedStats = [];
        this.winner = null;
    }

    //================================================================
    // Public API
    //================================================================

    /**
     * Executes a command sent from the Orchestrator.
     * @param {OrchestratorToGameCommand} gameCommand The command to execute.
     */
    executeGameCommand(gameCommand) {
        switch (gameCommand.actionType) {
            case GAME_COMMANDS.ASSIGN_NEW_POKEMON:
                this.#handleAssignNewPokemon(gameCommand.payload);
                break;
            case GAME_COMMANDS.BATTLE_END:
                this.#handleBattleEnd();
                break;
            case GAME_COMMANDS.SELECT_STAT:
                this.#handleSelectStat(
                    gameCommand.payload,
                    gameCommand.clientId
                );
                break;
            default:
                logger.warn(
                    `[Game] Unknown command: ${gameCommand.actionType}`
                );
        }
    }

    //================================================================
    // Private Command Handlers
    //================================================================

    #handleAssignNewPokemon(payload) {
        this.players[0].setPokemon(payload[0]);
        this.players[1].setPokemon(payload[1]);
        this.phase = GAME_PHASES.SELECT_STAT;
    }

    #handleSelectStat(payload, clientId) {
        if (this.lockedStats.includes(payload)) {
            logger.warn(`[Game] Stat ${payload} is locked`);
            this.#emitGameEvent(
                GAME_EVENTS.INVALID_STAT_SELECT,
                { reason: `Stat ${payload} is locked.` },
                clientId
            );
            return;
        }

        const player = this.#findPlayer(clientId);
        const statValue = player.pokemon.stats[payload];
        player.setSelectedStat(payload, statValue);

        if (this.#isAllSelected()) {
            this.phase = GAME_PHASES.BATTLE;
            this.#emitGameEvent(GAME_EVENTS.ALL_SELECTED);
        }
    }

    #handleBattleEnd() {
        logger.log(`[Game] Handling battle end`);
        this.#evaluateBattleOutcome();
    }

    #handleGameEnd() {
        this.winner = this.players.reduce((a, b) =>
            a.points > b.points ? a : b
        ).name;
        this.phase = GAME_PHASES.GAME_FINISHED;
        this.#emitGameEvent(GAME_EVENTS.GAME_FINISHED);
    }

    //================================================================
    // Private Game Flow Logic
    //================================================================

    #evaluateBattleOutcome() {
        const [p1, p2] = this.players;
        let p1RoundScore = 0;

        // P1's challenge: P1's selected stat vs P2's value for that same stat
        if (p1.selectedStat.value > p2.pokemon.stats[p1.selectedStat.name]) {
            p1RoundScore++;
        } else if (
            p1.selectedStat.value < p2.pokemon.stats[p1.selectedStat.name]
        ) {
            p1RoundScore--;
        }

        // P2's challenge: P2's selected stat vs P1's value for that same stat
        if (p2.selectedStat.value > p1.pokemon.stats[p2.selectedStat.name]) {
            p1RoundScore--;
        } else if (
            p2.selectedStat.value < p1.pokemon.stats[p2.selectedStat.name]
        ) {
            p1RoundScore++;
        }

        if (p1RoundScore > 0) {
            p1.addPoint();
            logger.log(`[Game] ${p1.name} wins the round.`);
        } else if (p1RoundScore < 0) {
            p2.addPoint();
            logger.log(`[Game] ${p2.name} wins the round.`);
        } else {
            logger.log(`[Game] The round is a draw.`);
            this.#nextRound();
            return;
        }

        if (this.#isThereAWinner()) {
            this.#handleGameEnd();
        } else {
            this.#newBattle();
        }
    }

    #nextRound() {
        this.lockedStats.push(this.players[0].selectedStat.name);
        this.lockedStats.push(this.players[1].selectedStat.name);
        this.players.forEach((p) => p.resetSelectedStat());
        this.phase = GAME_PHASES.SELECT_STAT;
    }

    #newBattle() {
        this.lockedStats = [];
        this.players.forEach((p) => p.resetSelectedStat());
        this.#emitGameEvent(GAME_EVENTS.NEW_BATTLE);
    }

    //================================================================
    // Private Helpers
    //================================================================

    #emitGameEvent(eventType, payload = null, clientId = null) {
        const command = new GameToOrchestratorCommand(
            eventType,
            payload,
            clientId
        );
        this.emit("gameEvent", command);
    }

    #isThereAWinner() {
        return this.players.some((p) => p.points >= 3);
    }

    #findPlayer(clientId) {
        const player = this.players.find((p) => p.uuid === clientId);
        if (!player) {
            throw new Error(
                `Player with client ID '${clientId}' not found in this game.`
            );
        }
        return player;
    }

    #isAllSelected() {
        return this.players.every((p) => p.selectedStat.name !== null);
    }

    //================================================================
    // Serialization
    //================================================================

    /**
     * Returns a JSON representation of the Game
     * @returns {object} The game data
     */
    toJSON() {
        return {
            players: this.players.map((player) => player.toJSON()),
            phase: this.phase,
            lockedStats: this.lockedStats,
            winner: this.winner,
        };
    }

    /**
     * Creates a client-safe representation of the game for a specific client.
     * @param {string} clientUuid The UUID of the client for whom the game is being prepared.
     * @returns {object} The game object for the client.
     */
    toClientState(clientUuid) {
        const game = this.toJSON();
        game.players = null;

        const player1 = this.players[0].toJSON();
        const player2 = this.players[1].toJSON();

        game.you = clientUuid === player1.uuid ? player1 : player2;
        game.opponent = game.you === player1 ? player2 : player1;

        // Prevent cheating by obscuring which stat the opponent has selected
        if (game.phase === GAME_PHASES.SELECT_STAT) {
            game.opponent.selectedStat = null;
        }

        if (game.phase === GAME_PHASES.BATTLE) {
            game.you.challengeStat = game.you.selectedStat;
            game.opponent.challengeStat = game.opponent.selectedStat;

            game.you.challengedStat = {
                name: game.opponent.selectedStat.name,
                value: game.you.pokemon.stats[game.opponent.selectedStat.name],
            };
            game.opponent.challengedStat = {
                name: game.you.selectedStat.name,
                value: game.opponent.pokemon.stats[game.you.selectedStat.name],
            };
        }

        return game;
    }
}
