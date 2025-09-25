import { GamePhases, StatNames } from "../../shared/constants/constants";
import { Pokemon, Stat, PlayerInGameId } from "../../shared/types/types";
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
    firstMove: PlayerInGameId;
    you: PlayerState;
    opponent: PlayerState;
};

export type PlayerState = {
    inGameId: PlayerInGameId;
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
    isYouFirst: boolean;
    isChallenge1Win: boolean;
    isChallenge2Win: boolean;
    isChallenge1Tie: boolean;
    isChallenge2Tie: boolean;
} | null;

export type BattlePokemonAnimationState = {
    you: "attack" | "stumble" | "";
    opponent: "attack" | "stumble" | "";
};

export type NavigationHandler = (page: Pages, param?: boolean) => void;
