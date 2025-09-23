import { useMemo } from "react";
import { StatToDisplay } from "../constants/constants";
import { GameState, BattleStats } from "../types.js";

/**
 * Custom hook to encapsulate the business logic for the battle phase.
 * It computes derived state for Pokémon, stats, and battle outcomes from the raw `game`.
 *
 * @param  gameState - The current game state from the `roomState`.
 * @returns An object containing all necessary computed values for rendering the battle page.
 */
export const useBattleLogic = (gameState: GameState | null | undefined): BattleStats => {
    return useMemo(() => {
        if (!gameState || !gameState.you.challengeStat) {
            return null;
        }

        const yourPokemon = gameState.you.pokemon;
        const opponentPokemon = gameState.opponent.pokemon;

        const yourChallengeStat = gameState.you.challengeStat;
        const yourChallengedStat = gameState.you.challengedStat;
        const opponentChallengeStat = gameState.opponent.challengeStat;
        const opponentChallengedStat = gameState.opponent.challengedStat;

        // Determine outcomes
        const isYourChallengeTie = yourChallengedStat.value === opponentChallengeStat.value;
        const yourChallengeOutcome = yourChallengedStat.value > opponentChallengeStat.value;

        const isOpponentChallengeTie = opponentChallengedStat.value === yourChallengeStat.value;
        const opponentChallengeOutcome = yourChallengeStat.value < opponentChallengedStat.value;
        //////////////////////////////////////
        const isYouFirst = gameState.firstMove === gameState.you.inGameId;
        const isChallenge1Win = isYouFirst ? yourChallengeOutcome : opponentChallengeOutcome;
        const isChallenge2Win = isYouFirst ? opponentChallengeOutcome : yourChallengeOutcome;
        const isChallenge1Tie = isYouFirst ? isYourChallengeTie : isOpponentChallengeTie;
        const isChallenge2Tie = isYouFirst ? isOpponentChallengeTie : isYourChallengeTie;

        /////////////////////////////////////

        return {
            yourPokemon,
            opponentPokemon,
            yourPokemonImgUrl: yourPokemon.sprites.back_default,
            opponentPokemonImgUrl: opponentPokemon.sprites.officialArtwork,
            yourChallengeStat,
            yourChallengedStat,
            opponentChallengeStat,
            opponentChallengedStat,
            yourChallengeStatDisplay: StatToDisplay.get(yourChallengeStat.name),
            yourChallengedStatDisplay: StatToDisplay.get(yourChallengedStat.name),
            opponentChallengeStatDisplay: StatToDisplay.get(opponentChallengeStat.name),
            opponentChallengedStatDisplay: StatToDisplay.get(opponentChallengedStat.name),
            yourChallengeOutcome,
            isYourChallengeTie,
            opponentChallengeOutcome,
            isOpponentChallengeTie,
            isChallenge1Win,
            isChallenge2Win,
            isChallenge1Tie,
            isChallenge2Tie,
            isYouFirst,
        };
    }, [gameState]);
};
