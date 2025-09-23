import { useState, useEffect } from "react";
import styles from "./BattleColumns.module.scss";

type BattleColumnsProps = {
    yourValue: number;
    opponentValue: number;
    isStatBubbleAnimFinished: boolean;
    setColumnsFinished: (n: number) => void;
};

export default function BattleColumns({
    yourValue,
    opponentValue,
    setColumnsFinished,
    isStatBubbleAnimFinished,
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

    const upperWon = opponentValue > yourValue;

    // upper column growth
    useEffect(() => {
        if (!isStatBubbleAnimFinished) return;
        upperGrowthInterval = setInterval(() => {
            // setUpperValue(Math.round((currentUpperHeight / 100) * total));
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
                    ${growingFinished && !upperWon ? styles.lowlight : ""}
                    ${growingFinished && upperWon ? styles.upperHighlight : ""}
                `}
                style={{ height: `${currentUpperHeight}%` }}
            >
                <span className={styles.valueText}>{upperValue}</span>
            </div>
            <div
                className={`
                    ${styles.column} 
                    ${styles.lowerColumn} 
                    ${growingFinished && upperWon ? styles.lowlight : ""}
                    ${growingFinished && !upperWon ? styles.lowerHighlight : ""}
                `}
                style={{ height: `${currentLowerHeight}%` }}
            >
                <span className={styles.valueText}>{lowerValue}</span>
            </div>
        </div>
    );
}
