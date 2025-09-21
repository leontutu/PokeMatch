import { GamePhases, StatNames } from "../../shared/constants/constants";
import { Pokemon, Stat } from "../../shared/types/types";
import { Pages } from "./constants/constants";

export type RoomState = {
    id: number;
    clientRecords: ClientRecord[];
    game: GameState | null;
};

export type ClientRecord = {
    client: { name: string };
    isReady: boolean;
};

export type GameState = {
    phase: GamePhases;
    lockedStats: StatNames[];
    winner: string | null;
    you: PlayerState;
    opponent: PlayerState;
};

export type PlayerState = {
    name: string;
    points: number;
    challengeStat: Stat;
    challengedStat: Stat;
    pokemon: Pokemon;
};

export type BattleStats = {
    yourPokemon: Pokemon;
    opponentPokemon: Pokemon;
    yourPokemonImgUrl: string;
    opponentPokemonImgUrl: string;
    yourChallengeStat: Stat;
    yourChallengedStat: Stat;
    opponentChallengeStat: Stat;
    opponentChallengedStat: Stat;
    yourChallengeStatDisplay: string | undefined;
    yourChallengedStatDisplay: string | undefined;
    opponentChallengeStatDisplay: string | undefined;
    opponentChallengedStatDisplay: string | undefined;
    yourChallengeOutcome: boolean;
    isYourChallengeTie: boolean;
    opponentChallengeOutcome: boolean;
    isOpponentChallengeTie: boolean;
} | null;

export type NavigationHandler = (page: Pages, param?: boolean) => void;

// export const mockRoomState = {
//     id: "0",
//     clientRecords: [
//         { client: { name: "Foo" }, isReady: true },
//         { client: { name: "Bar" }, isReady: false },
//     ],
//     game: {
//         phase: GAME_PHASES.SELECT_STAT,
//         lockedStats: ["speed", "defense"],
//         winner: "Foo",
//         you: {
//             name: "Foo",
//             points: 0,
//             challengeStat: { name: "speed", value: 100 },
//             challengedStat: { name: "defense", value: 100 },
//             pokemon: {
//                 name: "pikachu",
//                 types: ["electric", "flying"],
//                 sprites: {
//                     back_default:
//                         "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/150.png",
//                     officialArtwork:
//                         "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
//                 },
//                 stats: {
//                     hp: 35,
//                     attack: 55,
//                     defense: 40,
//                     specialAttack: 50,
//                     specialDefense: 50,
//                     speed: 90,
//                     height: 4,
//                     weight: 3,
//                 },
//             },
//         },
//         opponent: {
//             name: "Bar",
//             points: 0,
//             challengeStat: { name: "defense", value: 105 },
//             challengedStat: { name: "speed", value: 90 },
//             pokemon: {
//                 name: "kabutops",
//                 types: ["rock", "water"],
//                 sprites: {
//                     back_default:
//                         "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/141.png",
//                     officialArtwork:
//                         "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/141.png",
//                 },
//                 stats: {
//                     hp: 60,
//                     attack: 115,
//                     defense: 105,
//                     specialAttack: 65,
//                     specialDefense: 70,
//                     speed: 90,
//                     height: 113,
//                     weight: 405,
//                 },
//             },
//         },
//     },
// };
