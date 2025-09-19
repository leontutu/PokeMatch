/**
 * Shared constants for client-server communication and game logic.
 */

/**
 * Socket.IO event names for communication between client and server.
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
 * Commands to the game on the server
 * OPTIMIZE: Refactor server commands to server and use a union type
 */
export enum GAME_COMMANDS {
    // from client
    SELECT_STAT = "selectStat", // Client selects a stat, payload being the stat name as string

    // from server/system
    ASSIGN_NEW_POKEMON = "assignNewPokemon",
    BATTLE_END = "battleEnd",
}

/**
 * Enumerates the different phases of the game.
 */
export enum GAME_PHASES {
    SELECT_STAT = "selectStat",
    BATTLE = "battle",
    GAME_FINISHED = "gameFinished",
    POKEMON_REVEAL = "pokemonReveal",
}

export enum STAT_NAMES {
    HP = "hp",
    ATTACK = "attack",
    DEFENSE = "defense",
    SPECIAL_ATTACK = "specialAttack",
    SPECIAL_DEFENSE = "specialDefense",
    SPEED = "speed",
    WEIGHT = "weight",
    HEIGHT = "height",
}

export enum TYPES {
    NORMAL = "normal",
    FIRE = "fire",
    FIGHTING = "fighting",
    WATER = "water",
    FLYING = "flying",
    GRASS = "grass",
    POISON = "poison",
    ELECTRIC = "electric",
    GROUND = "ground",
    PSYCHIC = "psychic",
    ROCK = "rock",
    ICE = "ice",
    BUG = "bug",
    DRAGON = "dragon",
    GHOST = "ghost",
    DARK = "dark",
    STEEL = "steel",
    FAIRY = "fairy",
    STELLAR = "stellar",
}

/**
 * Timing constants for various game events.
 */
export enum TIMINGS {
    BATTLE_DURATION = 12000,
    PAGE_TRANSITION = 1500,
}
