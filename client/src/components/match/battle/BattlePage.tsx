import styles from "./BattlePage.module.css";
import MatchLayout from "../layout/MatchLayout";
import { useState, useEffect } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import { useBattleLogic } from "../../../hooks/useBattleLogic";
import PokemonDisplay from "./PokemonDisplay";
import { NavigationHandler } from "../../../types";
import BattleField from "./BattleField";
import useSound from "use-sound";
import { useUIInfoContext } from "../../../contexts/UIInfoContext";

type BattlePageProps = {
    onNavigate: NavigationHandler;
};

/**
 * Orchestrates the battle phase of the game.
 *
 * This component displays a countdown, followed by the reveal of both players'
 * chosen stats and the battle outcome. It uses the `useBattleLogic` hook to
 * compute results and composes smaller components to build the UI.
 *
 * @example
 * <BattlePage onNavigate={handleNavigation} />
 */
export default function BattlePage({ onNavigate }: BattlePageProps) {
    const { roomState, sendBattleEnd: sendBattlePhaseFinished } = useSocket();
    const battleStats = useBattleLogic(roomState?.game);
    const { isWipingIn } = useUIInfoContext();
    const [columnsFinished, setColumnsFinished] = useState(0);
    const [battle1Finished, setBattle1Finished] = useState(false);

    const [youAttacking, setYouAttacking] = useState(false);
    const [oppAttacking, setOppAttacking] = useState(false);
    const [youFlashing, setYouFlashing] = useState(false);
    const [oppFlashing, setOppFlashing] = useState(false);

    const youCryUrl = battleStats
        ? `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${battleStats?.yourPokemon.id}.ogg`
        : "";
    const [playYouCry] = useSound(youCryUrl, { volume: 1, format: "ogg" });

    const oppCryUrl = battleStats
        ? `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${battleStats?.opponentPokemon.id}.ogg`
        : "";
    const [playOppCry] = useSound(oppCryUrl, { volume: 1, format: "ogg" });

    const [playNormalEffective] = useSound("/normal-effective.mp3", { volume: 1 });

    const ATTACK_ANIMATION_DURATION = 3000;
    const ATTACK_START_TO_IMPACT = 1150;

    useEffect(() => {
        if (!battleStats || isWipingIn) return;

        let phaseTimeout: ReturnType<typeof setTimeout>;

        // First battle phase (your challenge)
        if (columnsFinished === 1) {
            console.log("Battle 1 finished");

            if (battleStats.isChallenge1Tie) {
                console.log("It's a tie!");
                // Immediately move to the next battle
                setBattle1Finished(true);
                return;
            }

            if (battleStats.isChallenge1Win) {
                console.log("You won!");
                playBattleAnims(true);
            } else {
                console.log("You lost!");
                playBattleAnims(false);
            }

            phaseTimeout = setTimeout(() => {
                console.log("Battle 1 over");
                setBattle1Finished(true);
                resetBattleAnims();
            }, ATTACK_ANIMATION_DURATION);
        }

        // Second battle phase (opponent's challenge)
        if (columnsFinished === 2) {
            console.log("Battle 2 finished");

            if (battleStats.isChallenge2Tie) {
                console.log("It's a tie!");
                // Immediately end the phase
                sendBattlePhaseFinished();
                return;
            }

            if (battleStats.isChallenge2Win) {
                console.log("You won!");
                playBattleAnims(true);
            } else {
                console.log("You lost!");
                playBattleAnims(false);
            }

            phaseTimeout = setTimeout(() => {
                console.log("Battle 2 over");
                sendBattlePhaseFinished();
            }, ATTACK_ANIMATION_DURATION);
        }

        return () => clearTimeout(phaseTimeout);
    }, [isWipingIn, columnsFinished, battleStats, sendBattlePhaseFinished]);

    const playBattleAnims = (yourAttack: boolean) => {
        if (yourAttack) {
            playYouCry();
            setYouAttacking(true);
            setOppFlashing(true);
        } else {
            playOppCry();
            setOppAttacking(true);
            setYouFlashing(true);
        }
        setTimeout(() => playNormalEffective(), ATTACK_START_TO_IMPACT);
    };

    const resetBattleAnims = () => {
        setYouAttacking(false);
        setOppAttacking(false);
        setYouFlashing(false);
        setOppFlashing(false);
    };

    if (!roomState || !roomState.game || !battleStats) {
        return <>Loading...</>;
    }

    return (
        <MatchLayout onNavigate={onNavigate}>
            <div className={styles.outerContainer}>
                <PokemonDisplay
                    pokemonName={battleStats.opponentPokemon.name}
                    imageUrl={battleStats.opponentPokemonImgUrl}
                    attack={oppAttacking}
                    stumble={oppFlashing}
                    isOpponent={true}
                />

                <div className={styles.battleSection}>
                    {!battle1Finished ? (
                        <BattleField
                            key="your-battle"
                            yourBattle={battleStats.isYouFirst}
                            battleStats={battleStats}
                            isWipingIn={isWipingIn}
                            setColumnsFinished={setColumnsFinished}
                        />
                    ) : (
                        <BattleField
                            key="opponent-battle"
                            yourBattle={!battleStats.isYouFirst}
                            battleStats={battleStats}
                            isWipingIn={isWipingIn}
                            setColumnsFinished={setColumnsFinished}
                        />
                    )}
                </div>

                <PokemonDisplay
                    pokemonName={battleStats.yourPokemon.name}
                    imageUrl={battleStats.yourPokemonImgUrl}
                    attack={youAttacking}
                    stumble={youFlashing}
                    isOpponent={false}
                />
            </div>
        </MatchLayout>
    );
}
