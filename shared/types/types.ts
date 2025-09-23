import { StatNames, PokemonTypes } from "../constants/constants.js";

export type Pokemon = {
    id: number;
    name: string;
    types: PokemonTypes[];
    stats: PokemonStats;
    sprites: Sprites;
};

export type Stat = {
    name: StatNames;
    value: number;
};

export type PokemonStats = {
    [key in StatNames]: number;
};

export type Sprites = {
    officialArtwork: string;
    back_default: string;
};

/**
 * This ID will be shared with the client
 * and is therefore separate to the players UUID
 * which is mainly used to associate game actions
 */
export type PlayerInGameId = 1 | 2;

export enum GamePhases {
    WAITING = "WAITING",
    SELECT_STAT = "SELECT_STAT",
    BATTLE = "BATTLE",
    GAME_OVER = "GAME_OVER",
}
