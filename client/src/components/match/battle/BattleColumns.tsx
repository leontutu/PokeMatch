import { useState, useEffect } from "react";
import styles from "./BattleColumns.module.scss";

/**
 * Renders two vertical columns representing competing stat values.
 *
 * This component visualizes a stat comparison by animating the height of two
 * opposing columns. It also includes a number counter that increments as the
 * columns grow. Once the columns reach their target height, it highlights the
 * winner and calls an `onFinished` callback after a delay.
 *
 * @param yourValue - The stat value for the player.
 * @param opponentValue - The stat value for the opponent.
 * @param isStatBubbleAnimFinished - A boolean that triggers the start of the column animation.
 * @param onFinished - A callback function that is called when the entire column animation sequence is complete.
 *
 * @example
 * <BattleColumns
 *   yourValue={100}
 *   opponentValue={80}
 *   isStatBubbleAnimFinished={true}
 *   onFinished={handleAnimationEnd}
 * />
 */

type BattleColumnsProps = {
    yourValue: number;
    opponentValue: number;
    isStatBubbleAnimFinished: boolean;
    onFinished: () => void;
};

export default function BattleColumns({
    yourValue,
    opponentValue,
    isStatBubbleAnimFinished,
    onFinished,
}: BattleColumnsProps) {
    const [currentUpperHeight, setCurrentUpperHeight] = useState(0);
    const [currentLowerHeight, setCurrentLowerHeight] = useState(0);

    const [upperValue, setUpperValue] = useState(0);
    const [lowerValue, setLowerValue] = useState(0);

    const total = yourValue + opponentValue;
    const lowerHeightPercent = (yourValue / total) * 100;
    const upperHeightPercent = (opponentValue / total) * 100;

    let upperGrowthInterval: ReturnType<typeof setInterval>;
    let lowerGrowthInterval: ReturnType<typeof setInterval>;

    const [isGrowing, setIsGrowing] = useState({ upper: false, lower: false });
    const [growingFinished, setGrowingFinished] = useState(false);

    const INTERVAL_TIMER = 50;
    const DELAY_BETWEEN_GROWTH_AND_OUTCOME = 500;
    const DELAY_BETWEEN_GROWTH_AND_FINISH = 2500;

    const isTie = opponentValue === yourValue;
    const upperWon = opponentValue > yourValue;

    // upper column growth
    useEffect(() => {
        if (!isStatBubbleAnimFinished) return;
        upperGrowthInterval = setInterval(() => {
            setCurrentUpperHeight((prev) => {
                setUpperValue(Math.round((prev / 100) * total));
                if (prev < upperHeightPercent) {
                    return prev + 1;
                } else {
                    setUpperValue(opponentValue);
                    clearInterval(upperGrowthInterval);
                    setIsGrowing((prev) => ({ ...prev, upper: true }));
                    return prev;
                }
            });
        }, INTERVAL_TIMER);
        return () => clearInterval(upperGrowthInterval);
    }, [isStatBubbleAnimFinished]);

    // lower column growth
    useEffect(() => {
        if (!isStatBubbleAnimFinished) return;
        lowerGrowthInterval = setInterval(() => {
            setCurrentLowerHeight((prev) => {
                setLowerValue(Math.round((prev / 100) * total));
                if (prev < lowerHeightPercent) {
                    return prev + 1;
                } else {
                    setLowerValue(yourValue);
                    clearInterval(lowerGrowthInterval);
                    setIsGrowing((prev) => ({ ...prev, lower: true }));
                    return prev;
                }
            });
        }, INTERVAL_TIMER);
        return () => clearInterval(lowerGrowthInterval);
    }, [isStatBubbleAnimFinished]);

    // both columns finished growing
    useEffect(() => {
        let [timerA, timerB]: ReturnType<typeof setTimeout>[] = [];
        if (isGrowing.upper && isGrowing.lower) {
            timerA = setTimeout(() => {
                setGrowingFinished(true);
            }, DELAY_BETWEEN_GROWTH_AND_OUTCOME);
            timerB = setTimeout(() => {
                onFinished();
            }, DELAY_BETWEEN_GROWTH_AND_FINISH);
        }
        return () => {
            clearTimeout(timerA);
            clearTimeout(timerB);
        };
    }, [isGrowing]);

    return (
        <div className={styles.columnsContainer}>
            <div
                className={`
                    ${styles.column} 
                    ${styles.upperColumn} 
                    ${growingFinished && !isTie && !upperWon ? styles.lowlight : ""}
                    ${growingFinished && !isTie && upperWon ? styles.upperHighlight : ""}
                `}
                style={{ height: `${currentUpperHeight}%` }}
            >
                <span className={styles.valueText}>{upperValue}</span>
            </div>
            <div
                className={`
                    ${styles.column} 
                    ${styles.lowerColumn} 
                    ${growingFinished && !isTie && upperWon ? styles.lowlight : ""}
                    ${growingFinished && !isTie && !upperWon ? styles.lowerHighlight : ""}
                `}
                style={{ height: `${currentLowerHeight}%` }}
            >
                <span className={styles.valueText}>{lowerValue}</span>
            </div>
        </div>
    );
}
