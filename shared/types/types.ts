import { STAT_NAMES, TYPES } from "../constants/constants";

export type Pokemon = {
    id: number;
    name: string;
    types: TYPES[];
    stats: PokemonStats;
    sprites: Sprites;
};

export type Stat = {
    name: STAT_NAMES;
    value: number;
};

export type PokemonStats = {
    [key in STAT_NAMES]: number;
};

export type Sprites = {
    officialArtwork: string;
    back_default: string;
};
