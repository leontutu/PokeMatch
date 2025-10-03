import styles from "./BattlePage.module.css";
import MatchLayout from "../layout/MatchLayout";
import { useSocket } from "../../../contexts/SocketContext";
import { useBattleLogic } from "../../../hooks/useBattleLogic";
import PokemonDisplay from "./PokemonDisplay";
import { NavigationHandler } from "../../../types";
import BattleField from "./BattleField";
import { useUIInfoContext } from "../../../contexts/UIInfoContext";
import { useBattleSequence } from "../../../hooks/useBattleSequence";
import { useEffect, useState, useRef } from "react";

type BattlePageProps = {
    onNavigate: NavigationHandler;
};

/**
 * Orchestrates the entire battle phase of a match.
 *
 * This component serves as the main container for the battle sequence. It uses the
 * `useBattleLogic` hook to derive battle statistics and the `useBattleSequence` hook
 * to manage the complex flow of animations and state transitions. It renders the
 * player and opponent `PokemonDisplay` components and the central `BattleField`,
 * progressing from the first battle to the second until a winner is decided.
 *
 * @param onNavigate - A handler for navigating to other parts of the application.
 *
 * @example
 * <BattlePage onNavigate={handleNavigation} />
 */

export default function BattlePage({ onNavigate }: BattlePageProps) {
    const { viewRoom, sendBattleEnd } = useSocket();

    // hack: Making sure page can still render properly during page out transition
    const currentBattleStats = useBattleLogic(viewRoom?.viewGame);
    const battleStatsRef = useRef(currentBattleStats);
    if (currentBattleStats) battleStatsRef.current = currentBattleStats;
    const battleStats = battleStatsRef.current;

    const { isWipingIn } = useUIInfoContext();
    const [activeBattle, setActiveBattle] = useState<1 | 2>(1);

    const { phase, setPhase, pokemonAnimation, isFading } = useBattleSequence(
        battleStats,
        sendBattleEnd,
        isWipingIn
    );

    useEffect(() => {
        if (phase === "COLUMNS_2_START") {
            setActiveBattle(2);
        }
    }, [phase]);

    if (!battleStats) {
        return <>Loading...</>;
    }

    return (
        <MatchLayout onNavigate={onNavigate}>
            <div className={styles.outerContainer}>
                <PokemonDisplay
                    pokemonName={battleStats.opponentPokemon.name}
                    imageUrl={battleStats.opponentPokemonImgUrl}
                    animation={pokemonAnimation.opponent}
                    isOpponent={true}
                />
                <div className={styles.battleSectionWrapper}>
                    {phase === "WAITING" ? null : phase !== "SHOW_CURRENT_ROUND" ? (
                        <div className={`${styles.battleSection} ${isFading ? styles.fadeOut : ""}`}>
                            <BattleField
                                key={activeBattle === 1 ? "battle-1" : "battle-2"}
                                yourBattle={
                                    activeBattle === 1 ? battleStats.isYouFirst : !battleStats.isYouFirst
                                }
                                battleStats={battleStats}
                                isWipingIn={isWipingIn}
                                onFinished={() =>
                                    setPhase(activeBattle === 1 ? "COLUMNS_1_END" : "COLUMNS_2_END")
                                }
                            />
                        </div>
                    ) : (
                        <img
                            src={`/round-${viewRoom?.viewGame?.currentRound}.png`}
                            alt="Round ?"
                            className={styles.showCurrentRoundImg}
                        />
                    )}
                </div>
                <PokemonDisplay
                    pokemonName={battleStats.yourPokemon.name}
                    imageUrl={battleStats.yourPokemonImgUrl}
                    animation={pokemonAnimation.you}
                    isOpponent={false}
                />
            </div>
        </MatchLayout>
    );
}
