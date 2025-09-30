import { GamePhases, StatNames } from "../../../shared/constants/constants.js";
import { PlayerInGameId, Pokemon, Stat } from "../../../shared/types/types.js";
import { GameEvents } from "../constants/constants.js";
import { EventEmitter } from "events";
import { GameCommands } from "../../../shared/constants/constants.js";
import logger from "../utils/Logger.js";
import Player from "./Player.js";
import OrchestratorToGameCommand from "../commands/OrchestratorToGameCommand.js";
import GameToOrchestratorCommand from "../commands/GameToOrchestratorCommand.js";

/**
 * Represents the core game logic for a single match.
 * Manages players, game phases, battle rounds, and scoring.
 * Emits events to the Orchestrator to signal state changes.
 */
export default class Game extends EventEmitter {
    players: Player[];
    phase: GamePhases;
    lockedStats: StatNames[];
    firstMove: PlayerInGameId;
    winner: string | null;
    constructor(public participants: { name: string; uuid: string }[]) {
        super();
        this.players = participants.map(
            (p, index) => new Player(p.name, p.uuid, (index + 1) as PlayerInGameId)
        );
        this.phase = GamePhases.SELECT_STAT;
        this.lockedStats = [];
        this.firstMove = (Math.floor(Math.random() * 2) + 1) as PlayerInGameId;
        this.winner = null;
    }

    //================================================================
    // Public API
    //================================================================

    /**
     * Executes a command sent from the Orchestrator.
     * @param gameCommand The command to execute.
     */
    executeGameCommand(gameCommand: OrchestratorToGameCommand) {
        switch (gameCommand.actionType) {
            case GameCommands.ASSIGN_NEW_POKEMON:
                this.#handleAssignNewPokemon(gameCommand.payload);
                break;
            case GameCommands.BATTLE_END:
                this.#handleBattleEnd();
                break;
            case GameCommands.SELECT_STAT:
                this.#handleSelectStat(gameCommand.payload, gameCommand.clientId!);
                break;
            case GameCommands.START_SELECT_STAT:
                this.#handleStartSelectStat();
                break;
            default:
                logger.warn(`[Game] Unknown command: ${gameCommand.actionType}`);
        }
    }

    //================================================================
    // Private Command Handlers
    //================================================================

    #handleAssignNewPokemon(payload: Pokemon[]) {
        this.players[0].setPokemon(payload[0]);
        this.players[1].setPokemon(payload[1]);
        this.phase = GamePhases.POKEMON_REVEAL;
    }

    #handleSelectStat(payload: StatNames, clientId: string) {
        if (this.lockedStats.includes(payload)) {
            logger.warn(`[Game] Stat ${payload} is locked`);
            this.#emitGameEvent(
                GameEvents.INVALID_STAT_SELECT,
                { reason: `Stat ${payload} is locked.` },
                clientId
            );
            return;
        }

        const player = this.#findPlayer(clientId);
        const statValue = player.pokemon!.stats[payload];
        const stat: Stat = { name: payload, value: statValue };
        player.setSelectedStat(stat);

        if (this.#isAllSelected()) {
            this.phase = GamePhases.BATTLE;
            this.#emitGameEvent(GameEvents.ALL_SELECTED);
        }
    }

    #handleBattleEnd() {
        if (this.phase !== GamePhases.BATTLE) return;
        this.#evaluateBattleOutcome();
    }

    #handleStartSelectStat() {
        this.phase = GamePhases.SELECT_STAT;
    }

    //================================================================
    // Private Game Flow Logic
    //================================================================

    #evaluateBattleOutcome() {
        const [p1, p2] = this.players;

        //OPTIMIZE: find a better solution to this
        if (
            !p1.pokemon ||
            !p2.pokemon ||
            p1.selectedStat === null ||
            p2.selectedStat === null ||
            typeof p2.pokemon.stats[p1.selectedStat.name] !== "number" ||
            typeof p1.pokemon.stats[p2.selectedStat.name] !== "number"
        ) {
            logger.warn("[Game] Cannot evaluate battle outcome: missing data");
            return;
        }

        let p1RoundScore = 0;

        // P1's challenge: P1's selected stat vs P2's value for that same stat
        if (p1.selectedStat.value > p2.pokemon.stats[p1.selectedStat.name]) {
            p1RoundScore++;
        } else if (p1.selectedStat.value < p2.pokemon.stats[p1.selectedStat.name]) {
            p1RoundScore--;
        }

        // P2's challenge: P2's selected stat vs P1's value for that same stat
        // @ts-ignore
        if (p2.selectedStat.value > p1.pokemon.stats[p2.selectedStat.name]) {
            p1RoundScore--;
        } else if (
            // @ts-ignore
            p2.selectedStat.value < p1.pokemon.stats[p2.selectedStat.name]
        ) {
            p1RoundScore++;
        }

        if (p1RoundScore > 0) {
            p1.addPoint();
            logger.debug(`[Game] ${p1.name} wins the round.`);
        } else if (p1RoundScore < 0) {
            p2.addPoint();
            logger.debug(`[Game] ${p2.name} wins the round.`);
        } else {
            logger.debug(`[Game] The round is a draw.`);
            this.#nextRound();
            return;
        }

        if (this.#isThereAWinner()) {
            this.#gameEnd();
        } else {
            this.#newBattle();
        }
    }

    #nextRound() {
        this.lockedStats.push(this.players[0].selectedStat!.name);
        this.lockedStats.push(this.players[1].selectedStat!.name);
        this.players.forEach((p) => p.resetSelectedStat());
        this.phase = GamePhases.SELECT_STAT;
    }

    #gameEnd() {
        this.winner = this.players.reduce((a, b) => (a.points > b.points ? a : b)).name;
        this.phase = GamePhases.GAME_FINISHED;
        this.#emitGameEvent(GameEvents.GAME_FINISHED);
    }

    #newBattle() {
        this.firstMove = this.firstMove === 1 ? 2 : (1 as PlayerInGameId);
        this.lockedStats = [];
        this.players.forEach((p) => p.resetSelectedStat());
        this.#emitGameEvent(GameEvents.NEW_MATCH);
    }

    //================================================================
    // Private Helpers
    //================================================================

    #emitGameEvent(eventType: GameEvents, payload: any = null, clientId: string | null = null) {
        const command = new GameToOrchestratorCommand(eventType, payload, clientId);
        this.emit("gameEvent", command);
    }

    #isThereAWinner() {
        return this.players.some((p) => p.points >= 3);
    }

    #findPlayer(clientId: string) {
        const player = this.players.find((p) => p.uuid === clientId);
        if (!player) {
            throw new Error(`Player with client ID '${clientId}' not found in this game.`);
        }
        return player;
    }

    #isAllSelected() {
        return this.players.every((p) => p.selectedStat !== null);
    }
}
