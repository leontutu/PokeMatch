import { Pokemon, Stat } from "../../shared/types/types";
import { Pages } from "./constants/constants";

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
