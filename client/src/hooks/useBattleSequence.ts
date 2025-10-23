import { useState, useEffect } from "react";
import { useSound } from "use-sound";
import { BattleStats, BattlePokemonAnimationState } from "../types";
import { useSocketContext } from "../contexts/SocketContext";
import normalEffective from "../assets/audio/sounds/normal-effective.mp3";

/**
 * Manages the state and timing for the entire battle sequence.
 *
 * This hook encapsulates the complex logic of a battle, including attack animations,
 * sound effects, phase transitions (from battle 1 to 2), and fading effects.
 * It returns state variables that the `BattlePage` component can use to drive its UI,
 * abstracting away the timers and state management.
 *
 * @param battleStats - The computed stats and outcomes for the battle.
 * @param onBattleEnd - A callback function to signal the end of the entire battle sequence.
 * @param isWipingIn - A boolean to prevent animations from starting during a page transition.
 * @returns An object with the current phase, animation states, and a function to set the phase.
 *
 * @example
 * const { phase, setPhase, pokemonAnimation, isFading } = useBattleSequence(
 *   battleStats,
 *   sendBattleEnd,
 *   isWipingIn
 * );
 */

export enum BattlePhase {
    WAITING = "WAITING",
    SHOW_CURRENT_ROUND = "SHOW_CURRENT_ROUND",
    COLUMNS_1_START = "COLUMNS_1_START",
    COLUMNS_1_END = "COLUMNS_1_END",
    COLUMNS_2_START = "COLUMNS_2_START",
    COLUMNS_2_END = "COLUMNS_2_END",
    FINISHED = "FINISHED",
}
export const ATTACK_ANIMATION_DURATION = 3000;
export const ATTACK_START_TO_IMPACT = 1150;
export const FADE_OUT_DURATION = 1400;
export const SHOW_CURRENT_ROUND_DURATION = 3000;

export const useBattleSequence = (
    battleStats: BattleStats | null,
    onBattleEnd: () => void,
    isWipingIn: boolean
) => {
    const [phase, setPhase] = useState<BattlePhase>(BattlePhase.WAITING);
    const [pokemonAnimation, setPokemonAnimation] = useState<BattlePokemonAnimationState>({
        you: "",
        opponent: "",
    });
    const [isFading, setIsFading] = useState(false);
    const { viewRoom } = useSocketContext();

    const [playYouCry] = useSound(
        `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${battleStats?.yourPokemon.id}.ogg`
    );
    const [playOppCry] = useSound(
        `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${battleStats?.opponentPokemon.id}.ogg`
    );
    const [playNormalEffective] = useSound(normalEffective);

    const playBattleAnims = (isPlayerWinner: boolean) => {
        if (isPlayerWinner) {
            playYouCry();
            setPokemonAnimation({ you: "attack", opponent: "stumble" });
        } else {
            playOppCry();
            setPokemonAnimation({ you: "stumble", opponent: "attack" });
        }
        setTimeout(() => {
            playNormalEffective();
            awardTemporaryPoints();
        }, ATTACK_START_TO_IMPACT);
    };

    useEffect(() => {
        if (!battleStats || isWipingIn || phase === BattlePhase.SHOW_CURRENT_ROUND) return;

        if (phase === BattlePhase.WAITING) {
            setPhase(BattlePhase.SHOW_CURRENT_ROUND);
            setTimeout(() => {
                setPhase(BattlePhase.COLUMNS_1_START);
            }, SHOW_CURRENT_ROUND_DURATION);
        }

        if (phase === BattlePhase.COLUMNS_1_END) {
            if (battleStats.isChallenge1Tie) {
                setIsFading(true);
                setTimeout(() => {
                    setPhase(BattlePhase.COLUMNS_2_START);
                    setIsFading(false);
                }, FADE_OUT_DURATION);
            } else {
                playBattleAnims(battleStats.isChallenge1Win);
                setTimeout(() => {
                    setIsFading(true);
                    setTimeout(() => {
                        setPhase(BattlePhase.COLUMNS_2_START);
                        setIsFading(false);
                        setPokemonAnimation({ you: "", opponent: "" });
                    }, FADE_OUT_DURATION);
                }, ATTACK_ANIMATION_DURATION);
            }
        }

        if (phase === BattlePhase.COLUMNS_2_END) {
            setPhase(BattlePhase.FINISHED);
            if (battleStats.isChallenge2Tie) {
                onBattleEnd();
            } else {
                playBattleAnims(battleStats.isChallenge2Win);
                setTimeout(onBattleEnd, ATTACK_ANIMATION_DURATION);
            }
        }
    }, [phase, battleStats, isWipingIn, onBattleEnd]);

    /**
     * DISPLAY ONLY
     * Awards temporary `fake` points based on the outcome of the challenges.
     * These points are for display only and will be overwritten by the server.
     */
    const awardTemporaryPoints = () => {
        if (!battleStats || !viewRoom?.viewGame) return;

        const { viewGame } = viewRoom;
        const { isChallenge1Tie, isChallenge1Win, isChallenge2Tie, isChallenge2Win } = battleStats;

        if (phase === BattlePhase.COLUMNS_1_END) {
            if (isChallenge1Win) {
                viewGame.you.points += viewGame.currentRound;
            } else if (!isChallenge1Tie) {
                viewGame.opponent.points += viewGame.currentRound;
            }
        } else if (phase === BattlePhase.COLUMNS_2_END) {
            if (isChallenge2Win) {
                viewGame.you.points += viewGame.currentRound;
            } else if (!isChallenge2Tie) {
                viewGame.opponent.points += viewGame.currentRound;
            }
        }
    };

    return {
        phase,
        setPhase,
        pokemonAnimation,
        isFading,
    };
};
