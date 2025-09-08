import { useMemo } from "react";
import { STAT_TO_DISPLAY } from "../constants/constants";

/**
 * @typedef {object} BattleStats
 * @property {object} yourPokemon
 * @property {object} opponentPokemon
 * @property {string} yourPokemonImgUrl
 * @property {string} opponentPokemonImgUrl
 * @property {object} yourChallengeStat
 * @property {object} yourChallengedStat
 * @property {object} opponentChallengeStat
 * @property {object} opponentChallengedStat
 * @property {string} yourChallengeStatDisplay
 * @property {string} yourChallengedStatDisplay
 * @property {string} opponentChallengeStatDisplay
 * @property {string} opponentChallengedStatDisplay
 * @property {boolean} yourChallengeOutcome
 * @property {boolean} isYourChallengeTie
 * @property {boolean} opponentChallengeOutcome
 * @property {boolean} isOpponentChallengeTie
 */

/**
 * Custom hook to encapsulate the business logic for the battle phase.
 * It computes derived state for Pokémon, stats, and battle outcomes from the raw `game`.
 *
 * @param {object} game - The current game state from the `roomState`.
 * @returns {BattleStats} An object containing all necessary computed values for rendering the battle page.
 */
export const useBattleLogic = (game) => {
    return useMemo(() => {
        if (!game || !game.you.challengeStat) {
            // Return a default or empty structure if game is not ready
            return {
                yourPokemon: {},
                opponentPokemon: {},
                yourPokemonImgUrl: "",
                opponentPokemonImgUrl: "",
            };
        }

        const yourPokemon = game.you.pokemon;
        const opponentPokemon = game.opponent.pokemon;

        const yourChallengeStat = game.you.challengeStat;
        const yourChallengedStat = game.you.challengedStat;
        const opponentChallengeStat = game.opponent.challengeStat;
        const opponentChallengedStat = game.opponent.challengedStat;

        // Determine outcomes
        const isYourChallengeTie =
            yourChallengedStat.value === opponentChallengeStat.value;
        const yourChallengeOutcome =
            yourChallengedStat.value > opponentChallengeStat.value;

        const isOpponentChallengeTie =
            opponentChallengedStat.value === yourChallengeStat.value;
        const opponentChallengeOutcome =
            yourChallengeStat.value < opponentChallengedStat.value;

        return {
            yourPokemon,
            opponentPokemon,
            yourPokemonImgUrl: yourPokemon.sprites.back_default,
            opponentPokemonImgUrl: opponentPokemon.sprites.officialArtwork,
            yourChallengeStat,
            yourChallengedStat,
            opponentChallengeStat,
            opponentChallengedStat,
            yourChallengeStatDisplay: STAT_TO_DISPLAY.get(
                yourChallengeStat.name
            ),
            yourChallengedStatDisplay: STAT_TO_DISPLAY.get(
                yourChallengedStat.name
            ),
            opponentChallengeStatDisplay: STAT_TO_DISPLAY.get(
                opponentChallengeStat.name
            ),
            opponentChallengedStatDisplay: STAT_TO_DISPLAY.get(
                opponentChallengedStat.name
            ),
            yourChallengeOutcome,
            isYourChallengeTie,
            opponentChallengeOutcome,
            isOpponentChallengeTie,
        };
    }, [game]);
};
