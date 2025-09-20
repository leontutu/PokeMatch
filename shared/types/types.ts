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
