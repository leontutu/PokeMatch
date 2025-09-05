/**
 * Server-only game constants.
 */
import { GAME_COMMANDS as SHARED_GAME_COMMANDS } from "../../shared/constants.js";

/*
 * - GAME_EVENTS: Events emitted by the Game to the Orchestrator.
 */
export const GAME_EVENTS = {
    NEW_BATTLE: "newBattle",
    GAME_FINISHED: "gameFinished",
    INVALID_STAT_SELECT: "invalidStatSelect",
};

/*
 * GAME_COMMANDS: All commands the Game can execute (shared + server-only).
 */
export const GAME_COMMANDS = {
    ...SHARED_GAME_COMMANDS,
    ASSIGN_NEW_POKEMON: "assignNewPokemon",
    BATTLE_END: "battleEnd",
};

// export const ROOM_SHUTDOWN_TIMEOUT_MS = 3600000 * 10; // 10 hours
export const ROOM_SHUTDOWN_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours
