import { useState, useEffect } from "react";
import useSound from "use-sound";
import { BattleStats, BattlePokemonAnimationState } from "../types";

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
    const [animation, setAnimation] = useState<BattlePokemonAnimationState>({
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
            setAnimation({ you: "attack", opponent: "stumble" });
        } else {
            playOppCry();
            setAnimation({ you: "stumble", opponent: "attack" });
        }
        setTimeout(() => playNormalEffective(), ATTACK_START_TO_IMPACT);
    };

    useEffect(() => {
        if (!battleStats || isWipingIn) return;

        let timer: ReturnType<typeof setTimeout>;
        let fadeTimer: ReturnType<typeof setTimeout>;

        if (phase === "BATTLE_1_END") {
            // This phase is now only for triggering animations
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
                        setAnimation({ you: "", opponent: "" });
                    }, FADE_OUT_DURATION);
                }, ATTACK_ANIMATION_DURATION);
            }
        }

        if (phase === "BATTLE_2_END") {
            if (battleStats.isChallenge2Tie) {
                onBattleEnd();
            } else {
                playBattleAnims(battleStats.isChallenge2Win);
                console.log("hey");
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
        animation,
        isFading,
    };
};
