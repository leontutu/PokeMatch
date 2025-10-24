import { useMemo } from "react";
import { StatToDisplay } from "../constants/constants";
import { BattleStats } from "../types.js";
import { ViewGame } from "../../../shared/types/types.js";
import { StatNames } from "../../../shared/constants/constants.js";

/**
 * Custom hook to encapsulate the business logic for the battle phase.
 * It computes derived state for Pokémon, stats, and battle outcomes from the raw `game`.
 *
 * @param  viewGame - The current game state from the `viewRoom`.
 * @returns An object containing all necessary computed values for rendering the battle page.
 */
export const useBattleLogic = (viewGame: ViewGame | null | undefined): BattleStats => {
    return useMemo(() => {
        if (
            !viewGame ||
            !viewGame.you.challengeStat ||
            !viewGame.opponent.challengedStat ||
            !viewGame.opponent.challengeStat ||
            !viewGame.you.challengedStat
        ) {
            return null;
        }

        const yourPokemon = viewGame.you.pokemon;
        const opponentPokemon = viewGame.opponent.pokemon;

        const yourChallengeStat = { ...viewGame.you.challengeStat };
        const yourChallengedStat = { ...viewGame.you.challengedStat };
        const opponentChallengeStat = { ...viewGame.opponent.challengeStat };
        const opponentChallengedStat = { ...viewGame.opponent.challengedStat };

        // Determine outcomes
        const isYourChallengeTie = yourChallengeStat.value === opponentChallengedStat.value;
        const yourChallengeOutcome = yourChallengeStat.value > opponentChallengedStat.value;

        const isOpponentChallengeTie = opponentChallengeStat.value === yourChallengedStat.value;
        const opponentChallengeOutcome = opponentChallengeStat.value < yourChallengedStat.value;

        const isYouFirst = viewGame.firstMove === viewGame.you.inGameId;
        const isChallenge1Win = isYouFirst ? yourChallengeOutcome : opponentChallengeOutcome;
        const isChallenge2Win = isYouFirst ? opponentChallengeOutcome : yourChallengeOutcome;
        const isChallenge1Tie = isYouFirst ? isYourChallengeTie : isOpponentChallengeTie;
        const isChallenge2Tie = isYouFirst ? isOpponentChallengeTie : isYourChallengeTie;

        // Converting hectogram to kilogram
        [yourChallengeStat, yourChallengedStat, opponentChallengeStat, opponentChallengedStat].forEach(
            (stat) => {
                stat.value = stat.name == StatNames.WEIGHT ? stat.value / 10 : stat.value;
            }
        );

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
    }, [viewGame]);
};
