import { useState, useEffect } from "react";
import styles from "./BattleColumns.module.scss";

type BattleColumnsProps = {
    yourValue: number;
    opponentValue: number;
    setColumnsFinished: (n: number) => void;
};

export default function BattleColumns({
    yourValue,
    opponentValue,
    setColumnsFinished,
}: BattleColumnsProps) {
    const [currentUpperHeight, setCurrentUpperHeight] = useState(0);
    const [currentLowerHeight, setCurrentLowerHeight] = useState(0);

    const total = yourValue + opponentValue;
    const lowerHeightPercent = Math.round((yourValue / total) * 100);
    const upperHeightPercent = Math.round((opponentValue / total) * 100);

    let upperGrowthInterval: ReturnType<typeof setInterval>;
    let lowerGrowthInterval: ReturnType<typeof setInterval>;

    const [statBubbleAnimFinished, setStatBubbleAnimFinished] = useState(false);

    const [isGrowing, setIsGrowing] = useState({ upper: false, lower: false });
    const [growingFinished, setGrowingFinished] = useState(false);

    const INTERVAL_TIMER = 50;
    const DELAY_BETWEEN_GROWTH_AND_OUTCOME = 500;
    const DELAY_BETWEEN_GROWTH_AND_FINISH = 2500;
    const STAT_BUBBLE_ANIMATION_DURATION = 2000;

    const upperWon = opponentValue > yourValue;

    // wait for stat bubble animation to finish
    useEffect(() => {
        const timer = setTimeout(() => {
            setStatBubbleAnimFinished(true);
        }, STAT_BUBBLE_ANIMATION_DURATION);
        return () => clearTimeout(timer);
    }, []);

    // upper column growth
    useEffect(() => {
        if (!statBubbleAnimFinished) return;
        upperGrowthInterval = setInterval(() => {
            setCurrentUpperHeight((prev) => {
                if (prev < upperHeightPercent) {
                    return prev + 1;
                } else {
                    clearInterval(upperGrowthInterval);
                    setIsGrowing((prev) => ({ ...prev, upper: true }));
                    return prev;
                }
            });
        }, INTERVAL_TIMER);
        return () => clearInterval(upperGrowthInterval);
    }, [statBubbleAnimFinished]);

    // lower column growth
    useEffect(() => {
        if (!statBubbleAnimFinished) return;
        lowerGrowthInterval = setInterval(() => {
            setCurrentLowerHeight((prev) => {
                if (prev < lowerHeightPercent) {
                    return prev + 1;
                } else {
                    clearInterval(lowerGrowthInterval);
                    setIsGrowing((prev) => ({ ...prev, lower: true }));
                    return prev;
                }
            });
        }, INTERVAL_TIMER);
        return () => clearInterval(lowerGrowthInterval);
    }, [statBubbleAnimFinished]);

    // both columns finished growing
    useEffect(() => {
        let [timerA, timerB]: ReturnType<typeof setTimeout>[] = [];
        if (isGrowing.upper && isGrowing.lower) {
            timerA = setTimeout(() => {
                setGrowingFinished(true);
            }, DELAY_BETWEEN_GROWTH_AND_OUTCOME);
            timerB = setTimeout(() => {
                setColumnsFinished(((prev: number) => prev + 1) as unknown as number); // oof
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
                    ${growingFinished && !upperWon ? styles.opaque : ""}
                    ${growingFinished && upperWon ? styles.upperHighlight : ""}
                `}
                style={{ height: `${currentUpperHeight}%` }}
            >
                <span className={styles.percentageText}>
                    {`${Math.round((currentUpperHeight / 100) * total)}`}
                </span>
            </div>
            <div
                className={`
                    ${styles.column} 
                    ${styles.lowerColumn} 
                    ${growingFinished && upperWon ? styles.opaque : ""}
                    ${growingFinished && !upperWon ? styles.lowerHighlight : ""}
                `}
                style={{ height: `${currentLowerHeight}%` }}
            >
                <span className={styles.percentageText}>
                    {`${Math.round((currentLowerHeight / 100) * total)}`}
                </span>
            </div>
        </div>
    );
}
