/*
 * - GAME_EVENTS: Events emitted by the Game to the Orchestrator.
 */
export enum GameEvents {
    NEW_MATCH = "newMatch",
    GAME_FINISHED = "gameFinished",
    INVALID_STAT_SELECT = "invalidStatSelect",
    ALL_SELECTED = "allSelected",
}

export enum RoomEvents {
    NEW_ROOM = "newRoom",
}

export const ROOM_SHUTDOWN_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours
export const POINTS_NEEDED_FOR_WIN = 20; // Points required to win a game
