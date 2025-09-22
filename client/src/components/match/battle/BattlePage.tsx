import styles from "./BattlePage.module.css";
import MatchLayout from "../layout/MatchLayout";
import { useState, useEffect } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import { useBattleLogic } from "../../../hooks/useBattleLogic";
import PokemonDisplay from "./PokemonDisplay";
import { NavigationHandler } from "../../../types";
import BattleField from "./BattleField";

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
    const [columnsFinished, setColumnsFinished] = useState(0);
    const [battle1Finished, setBattle1Finished] = useState(false);
    const [youAttack, setYouAttack] = useState(false);
    const [opponentAttack, setOpponentAttack] = useState(false);

    const ATTACK_ANIMATION_DURATION = 2000;

    // BUG: This hook keeps firing after the second battle ends. This currently causes no issues.
    // I could not pinpoint the exact cause, I think a refactor of the animation orchestration
    // is in order, but i have to triage here and move on for now.
    // It seems to be caused by children rerendering
    // I would probably investigate BattleField rerendering first if I were to debug this
    useEffect(() => {
        if (!battleStats) return;

        let phaseTimeout: ReturnType<typeof setTimeout>;

        // First battle phase (your challenge)
        if (columnsFinished === 1) {
            console.log("Battle 1 finished");
            if (battleStats.isYourChallengeTie) {
                console.log("It's a tie!");
                setBattle1Finished(true); // Immediately move to the next battle
                return;
            }

            if (battleStats.yourChallengeStat.value > battleStats.opponentChallengedStat.value) {
                console.log("You won!");
                setYouAttack(true);
            } else {
                console.log("You lost!");
                setOpponentAttack(true);
            }

            phaseTimeout = setTimeout(() => {
                console.log("Battle 1 over");
                setYouAttack(false);
                setOpponentAttack(false);
                setBattle1Finished(true);
            }, ATTACK_ANIMATION_DURATION);
        }

        // Second battle phase (opponent's challenge)
        if (columnsFinished === 2) {
            console.log("Battle 2 finished");
            if (battleStats.isOpponentChallengeTie) {
                console.log("It's a tie!");
                sendBattlePhaseFinished(); // Immediately end the phase
                return;
            }

            if (battleStats.opponentChallengeStat.value < battleStats.yourChallengedStat.value) {
                console.log("You won!");
                setYouAttack(true);
            } else {
                console.log("You lost!");
                setOpponentAttack(true);
            }

            phaseTimeout = setTimeout(() => {
                console.log("Battle 2 over");
                sendBattlePhaseFinished();
            }, ATTACK_ANIMATION_DURATION);
        }

        // Cleanup function to clear the timeout if the component unmounts
        // or if the effect re-runs.
        return () => clearTimeout(phaseTimeout);
    }, [columnsFinished, battleStats, sendBattlePhaseFinished]);

    if (!roomState || !roomState.game || !battleStats) {
        return <>Loading...</>;
    }

    return (
        <MatchLayout onNavigate={onNavigate}>
            <div className={styles.outerContainer}>
                <PokemonDisplay
                    pokemonName={battleStats.opponentPokemon.name}
                    imageUrl={battleStats.opponentPokemonImgUrl}
                    attack={opponentAttack}
                    isOpponent={true}
                />

                <div className={styles.battleSection}>
                    {!battle1Finished ? (
                        <BattleField
                            key="your-battle"
                            battleStats={battleStats}
                            yourBattle={true}
                            setColumnsFinished={setColumnsFinished}
                        />
                    ) : (
                        <BattleField
                            key="opponent-battle"
                            battleStats={battleStats}
                            yourBattle={false}
                            setColumnsFinished={setColumnsFinished}
                        />
                    )}
                </div>

                <PokemonDisplay
                    pokemonName={battleStats.yourPokemon.name}
                    imageUrl={battleStats.yourPokemonImgUrl}
                    attack={youAttack}
                    isOpponent={false}
                />
            </div>
        </MatchLayout>
    );
}
