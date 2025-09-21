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
    const { roomState } = useSocket();
    const [columnsFinished, setColumnsFinished] = useState(0);
    const [battle1Finished, setBattle1Finished] = useState(false);
    const [youAttack, setYouAttack] = useState(false);
    const [opponentAttack, setOpponentAttack] = useState(false);

    const ATTACK_ANIMATION_DURATION = 2000;

    if (!roomState || !roomState.game) {
        return <>Loading...</>;
    }
    const battleStats = useBattleLogic(roomState.game);
    if (!battleStats) {
        return <>Loading...</>;
    }

    useEffect(() => {
        if (columnsFinished === 1) {
            console.log("Battle 1 finished");
            if (battleStats.isYourChallengeTie) {
                console.log("It's a tie!");
                // move to next battle
                return;
            }
            if (battleStats.yourChallengeStat.value > battleStats.opponentChallengedStat.value) {
                console.log("You won!");
                setYouAttack(true);
            } else {
                console.log("You lost!");
                setOpponentAttack(true);
            }
            setTimeout(() => {
                console.log("Continuing....");
                setYouAttack(false);
                setOpponentAttack(false);
                setBattle1Finished(true);

                // award points?
                // move to next battle
            }, ATTACK_ANIMATION_DURATION);
        }
    }, [columnsFinished]);

    useEffect(() => {
        if (columnsFinished === 2) {
            console.log("Battle 2 finished");
            if (battleStats.isOpponentChallengeTie) {
                console.log("It's a tie!");
                // move to next battle
                return;
            }
            if (battleStats.opponentChallengeStat.value < battleStats.yourChallengedStat.value) {
                console.log("You won!");
                setYouAttack(true);
            } else {
                console.log("You lost!");
                setOpponentAttack(true);
            }
            setTimeout(() => {
                console.log("Continuing....");
                // award points?
                // move to next battle
            }, ATTACK_ANIMATION_DURATION);
        }
    }, [columnsFinished]);

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
