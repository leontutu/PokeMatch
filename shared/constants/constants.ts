/**
 * Shared constants for client-server communication and game logic.
 */

/**
 * Socket.IO event names for communication between client and server.
 */
export enum Events {
    // Client to Server events
    CREATE_ROOM = "createRoom", // Client requests to create a new room
    JOIN_ROOM = "joinRoom", // Client requests to join a room (with room ID as payload)
    PLAY_VS_BOT = "playVsAI", // Client requests to play against AI
    NAME_ENTER = "nameEnter", // Client submits their name
    TOGGLE_READY = "ready", // Client waiting in Room is ready to start a game
    GAME_COMMAND = "gameCommand", // Client sends a game command (the payload being of type GAME_COMMANDS)
    LEAVE_ROOM = "leaveRoom", // Client wishes to leave the current room
    BATTLE_END = "battleEnd", // Client finished watching the battle phase animation

    // Server to Client events
    ROOM_FULL = "roomFull", // Room is full, cannot join
    UPDATE = "update", // With payload of updated room/game state
    ROOM_CRASH = "roomCrash", // Room crashed or was deleted
    NAME_ERROR = "nameError", // Name validation failed
    NAME_VALID = "nameValid", // Name was accepted
    SELECT_STAT_ERROR = "selectStatError", // Stat selection was invalid
    BAD_ROOM_ID = "badRoomId", // No enterable room with room Id was found
    DUPLICATE_UUID = "duplicateUUID", // Client with same UUID already exists on server
}

/**
 * Commands to the game on the server
 * OPTIMIZE: Refactor server commands to server and use a union type
 */
export enum GameCommands {
    // from client
    SELECT_STAT = "selectStat", // Client selects a stat, payload being the stat name as string

    // from server/system
    ASSIGN_NEW_POKEMON = "assignNewPokemon",
    BATTLE_END = "battleEnd",
    START_SELECT_STAT = "startSelectStat",
}

/**
 * Enumerates the different phases of the game.
 */
export enum GamePhases {
    SELECT_STAT = "selectStat",
    BATTLE = "battle",
    GAME_FINISHED = "gameFinished",
    POKEMON_REVEAL = "pokemonReveal",
}

export enum StatNames {
    HP = "hp",
    ATTACK = "attack",
    DEFENSE = "defense",
    SPECIAL_ATTACK = "specialAttack",
    SPECIAL_DEFENSE = "specialDefense",
    SPEED = "speed",
    WEIGHT = "weight",
    HEIGHT = "height",
}

export enum PokemonTypes {
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
export enum Timings {
    PAGE_TRANSITION = 1500,
    POKEMON_REVEAL_DURATION = 13000,
}
