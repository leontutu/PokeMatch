import { StatNames, PokemonTypes, GamePhases } from "../constants/constants.js";

export type Pokemon = {
    id: number;
    name: string;
    types: PokemonTypes[];
    stats: PokemonStats;
    sprites: PokemonSprites;
};

export type Stat = {
    name: StatNames;
    value: number;
};

export type PokemonStats = {
    [key in StatNames]: number;
};

export type PokemonSprites = {
    officialArtwork: string;
    back_default: string;
};

/**
 * This ID will be shared with the client
 * and is therefore separate to the players UUID
 * which is mainly used to associate game actions
 */
export type PlayerInGameId = 1 | 2;

export type ViewRoom = {
    id: number;
    viewClientRecords: ViewClientRecord[];
    viewGame: ViewGame | null;
};

export type ViewClientRecord = {
    clientName: string;
    isReady: boolean;
};

export type ViewGame = {
    phase: GamePhases;
    lockedStats: StatNames[];
    winner: string | null;
    firstMove: PlayerInGameId;
    you: ViewPlayer;
    opponent: ViewPlayer;
    currentRound: 1 | 2 | 3;
};

export type ViewPlayer = {
    inGameId: PlayerInGameId;
    name: string;
    points: number;
    challengeStat: Stat | null;
    challengedStat: Stat | null;
    pokemon: Pokemon;
};
