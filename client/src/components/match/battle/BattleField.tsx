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
