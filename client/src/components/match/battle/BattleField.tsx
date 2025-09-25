import BattleColumns from "./BattleColumns";
import StatBubble from "./StatBubble";
import styles from "./BattleField.module.css";
import { BattleStats } from "../../../types";
import { StatToDisplay } from "../../../constants/constants";
import { useEffect, useState } from "react";

type BattleFieldProps = {
    battleStats: BattleStats;
    yourBattle: boolean;
    isWipingIn: boolean;
    onFinished: () => void;
};

/**
 * Renders the central battlefield where stat comparisons occur.
 *
 * This component orchestrates the animation of a single battle round. It displays
 * the `StatBubble` to announce the contested stat, and then renders the `BattleColumns`
 * to visualize the outcome. It receives props to determine which battle it is
 * (the player's challenge or the opponent's) and calls `onFinished` when its
 * animation sequence is fully complete.
 *
 * @param battleStats - The computed stats and outcomes for the battle.
 * @param yourBattle - A boolean indicating if this is the player's challenge round.
 * @param isWipingIn - A boolean to prevent animations from starting during a page transition.
 * @param onFinished - A callback function to signal that this battle round's animation is finished.
 *
 * @example
 * <BattleField
 *   battleStats={stats}
 *   yourBattle={true}
 *   isWipingIn={false}
 *   onFinished={handleRoundEnd}
 * />
 */

export default function BattleField({
    battleStats,
    yourBattle,
    isWipingIn,
    onFinished,
}: BattleFieldProps) {
    const [isStatBubbleAnimFinished, setIsStatBubbleAnimFinished] = useState(false);
    const STAT_BUBBLE_ANIM_DURATION = 1500;

    useEffect(() => {
        if (isWipingIn) return;
        const statBubbleAnimTimeout = setTimeout(() => {
            setIsStatBubbleAnimFinished(true);
        }, STAT_BUBBLE_ANIM_DURATION);
        return () => clearTimeout(statBubbleAnimTimeout);
    }, [isWipingIn]);

    if (!battleStats) return <>Loading...</>;
    return (
        <>
            <BattleColumns
                onFinished={onFinished}
                isStatBubbleAnimFinished={isStatBubbleAnimFinished}
                yourValue={
                    yourBattle
                        ? battleStats.yourChallengeStat.value
                        : battleStats.yourChallengedStat.value
                }
                opponentValue={
                    yourBattle
                        ? battleStats.opponentChallengedStat.value
                        : battleStats.opponentChallengeStat.value
                }
            />
            <StatBubble
                label={
                    yourBattle
                        ? StatToDisplay.get(battleStats.yourChallengeStat.name)
                        : StatToDisplay.get(battleStats.opponentChallengeStat.name)
                }
                flipped={!yourBattle}
                className={
                    !isWipingIn
                        ? yourBattle
                            ? styles.youStatBubble
                            : styles.opponentStatBubble
                        : styles.hidden
                }
            />
        </>
    );
}
