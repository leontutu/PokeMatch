/**
 * Shared constants for client-server communication and game logic.
 *
 *
 * EVENTS: Socket.IO event names for communication between client and server.
 * GAME_COMMANDS: Command types that can be sent to the game engine.
 * GAME_PHASES: Enumerates the different phases of the game.
 */

export enum EVENTS {
    // Client to Server events
    NAME_ENTER = "nameEnter", // Client submits their name
    READY = "ready", // Client waiting in Room is ready to start a game
    GAME_COMMAND = "gameCommand", // Client sends a game command (the payload being of type GAME_COMMANDS)
    LEAVE_ROOM = "leaveRoom", // Client wishes to leave the current room

    // Server to Client events
    ROOM_FULL = "roomFull", // Room is full, cannot join
    UPDATE = "update", // With payload of updated room/game state
    ROOM_CRASH = "roomCrash", // Room crashed or was deleted
    NAME_ERROR = "nameError", // Name validation failed
    SELECT_STAT_ERROR = "selectStatError", // Stat selection was invalid
}

/**
 * Commands that get forwarded to the clients game
 */
export enum GAME_COMMANDS {
    SELECT_STAT = "selectStat", // Client selects a stat, payload being the stat name as string
}

/**
 * Enumerates the different phases of the game.
 */
export enum GAME_PHASES {
    SELECT_STAT = "selectStat",
    BATTLE = "battle",
    GAME_FINISHED = "gameFinished",
}

/**
 * Timing constants for various game events.
 */
export enum TIMINGS {
    BATTLE_DURATION = 12000,
    PAGE_TRANSITION = 1500,
}
