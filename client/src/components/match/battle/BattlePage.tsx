import styles from "./BattlePage.module.scss";
import MatchLayout from "../layout/MatchLayout";
import { useSocketContext } from "../../../contexts/SocketContext";
import { useBattleLogic } from "../../../hooks/useBattleLogic";
import PokemonDisplay from "./PokemonDisplay";
import BattleField from "./BattleField";
import { useUIInfoContext } from "../../../contexts/UIInfoContext";
import { useBattleSequence, BattlePhase } from "../../../hooks/useBattleSequence";
import { useEffect, useState, useRef } from "react";
import round1 from "../../../assets/graphics/game/round-1.png";
import round2 from "../../../assets/graphics/game/round-2.png";
import round3 from "../../../assets/graphics/game/round-3.png";
import { UI_TEXT } from "../../../constants/uiText";

/**
 * Orchestrates the entire battle phase of a match.
 *
 * This component serves as the main container for the battle sequence. It uses the
 * `useBattleLogic` hook to derive battle statistics and the `useBattleSequence` hook
 * to manage the complex flow of animations and state transitions. It renders the
 * player and opponent `PokemonDisplay` components and the central `BattleField`,
 * progressing from the first battle to the second until a winner is decided.
 *
 * NOTE:
 * **Testing approach**: Rather than unit testing this presentation layer with its
 * complex animation timing and ref management, I chose to:
 * 1. Thoroughly test the underlying `hooks` (business logic separation)
 * 2. Validate visual correctness through manual testing
 * With the current race conditions, testing would be
 * a) brittle
 * b) of little ROI, since the animation breaking will not cause any major bugs
 *
 * @param onNavigate - A handler for navigating to other parts of the application.
 *
 * @example
 * <BattlePage />
 */

export default function BattlePage() {
    const { viewRoom, sendBattleEnd } = useSocketContext();

    // hack: Making sure page can still render properly during page out transition
    const currentBattleStats = useBattleLogic(viewRoom?.viewGame);
    const battleStatsRef = useRef(currentBattleStats);
    if (currentBattleStats) battleStatsRef.current = currentBattleStats;
    const battleStats = battleStatsRef.current;

    const { isWipingIn } = useUIInfoContext();
    const [activeBattle, setActiveBattle] = useState<1 | 2>(1);
    const roundImages = [round1, round2, round3];

    const { phase, setPhase, pokemonAnimation, isFading } = useBattleSequence(
        battleStats,
        sendBattleEnd,
        isWipingIn
    );

    useEffect(() => {
        if (phase === BattlePhase.COLUMNS_2_START) {
            setActiveBattle(2);
        }
    }, [phase]);

    if (!battleStats) {
        return <>{UI_TEXT.MESSAGES.LOADING}</>;
    }

    return (
        <MatchLayout>
            <div className={styles.outerContainer}>
                <PokemonDisplay
                    pokemonName={battleStats.opponentPokemon.name}
                    imageUrl={battleStats.opponentPokemonImgUrl}
                    animation={pokemonAnimation.opponent}
                    isOpponent={true}
                />
                <div className={styles.battleSectionWrapper}>
                    {phase === BattlePhase.WAITING ? null : phase !== BattlePhase.SHOW_CURRENT_ROUND ? (
                        <div className={`${styles.battleSection} ${isFading ? styles.fadeOut : ""}`}>
                            <BattleField
                                key={activeBattle === 1 ? "battle-1" : "battle-2"}
                                yourBattle={
                                    activeBattle === 1 ? battleStats.isYouFirst : !battleStats.isYouFirst
                                }
                                battleStats={battleStats}
                                isWipingIn={isWipingIn}
                                onFinished={() =>
                                    setPhase(
                                        activeBattle === 1
                                            ? BattlePhase.COLUMNS_1_END
                                            : BattlePhase.COLUMNS_2_END
                                    )
                                }
                            />
                        </div>
                    ) : (
                        <img
                            src={roundImages[(viewRoom?.viewGame?.currentRound ?? 1) - 1]}
                            alt={UI_TEXT.ALT_TEXT.ROUND_IMAGE(viewRoom?.viewGame?.currentRound ?? 1)}
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
