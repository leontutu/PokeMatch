import { useState, useEffect } from "react";
import useSound from "use-sound";
import { BattleStats, BattlePokemonAnimationState } from "../types";

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

type BattlePhase = "BATTLE_1_START" | "BATTLE_1_END" | "BATTLE_2_START" | "BATTLE_2_END";
const ATTACK_ANIMATION_DURATION = 3000;
const ATTACK_START_TO_IMPACT = 1150;
const FADE_OUT_DURATION = 1400;

export const useBattleSequence = (
    battleStats: BattleStats | null,
    onBattleEnd: () => void,
    isWipingIn: boolean
) => {
    const [phase, setPhase] = useState<BattlePhase>("BATTLE_1_START");
    const [pokemonAnimation, setPokemonAnimation] = useState<BattlePokemonAnimationState>({
        you: "",
        opponent: "",
    });
    const [isFading, setIsFading] = useState(false);

    const [playYouCry] = useSound(
        `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${battleStats?.yourPokemon.id}.ogg`
    );
    const [playOppCry] = useSound(
        `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${battleStats?.opponentPokemon.id}.ogg`
    );
    const [playNormalEffective] = useSound("/normal-effective.mp3");

    const playBattleAnims = (isPlayerWinner: boolean) => {
        if (isPlayerWinner) {
            playYouCry();
            setPokemonAnimation({ you: "attack", opponent: "stumble" });
        } else {
            playOppCry();
            setPokemonAnimation({ you: "stumble", opponent: "attack" });
        }
        setTimeout(() => playNormalEffective(), ATTACK_START_TO_IMPACT);
    };

    useEffect(() => {
        if (!battleStats || isWipingIn) return;

        let timer: ReturnType<typeof setTimeout>;
        let fadeTimer: ReturnType<typeof setTimeout>;

        if (phase === "BATTLE_1_END") {
            if (battleStats.isChallenge1Tie) {
                setIsFading(true);
                timer = setTimeout(() => {
                    setPhase("BATTLE_2_START");
                    setIsFading(false);
                }, FADE_OUT_DURATION);
            } else {
                playBattleAnims(battleStats.isChallenge1Win);
                timer = setTimeout(() => {
                    setIsFading(true);
                    fadeTimer = setTimeout(() => {
                        setPhase("BATTLE_2_START");
                        setIsFading(false);
                        setPokemonAnimation({ you: "", opponent: "" });
                    }, FADE_OUT_DURATION);
                }, ATTACK_ANIMATION_DURATION);
            }
        }

        if (phase === "BATTLE_2_END") {
            if (battleStats.isChallenge2Tie) {
                onBattleEnd();
            } else {
                playBattleAnims(battleStats.isChallenge2Win);
                timer = setTimeout(onBattleEnd, ATTACK_ANIMATION_DURATION);
            }
        }

        return () => {
            clearTimeout(timer);
            clearTimeout(fadeTimer);
        };
    }, [phase, battleStats, isWipingIn, onBattleEnd]);

    return {
        phase,
        setPhase,
        pokemonAnimation,
        isFading,
    };
};
