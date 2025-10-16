import { memo } from "react";
import styles from "./SelectStatPage.module.scss";
import StatCard from "../shared/StatCard";

const CardWrapper = memo(
    ({ index, statName, baseStat, rotation, isSelected, onCardClick, isLocked }: any) => {
        return (
            <div
                className={styles.circleCard}
                style={{
                    transform: `rotate(${rotation}deg) translateY(-8rem)`,
                    zIndex: isLocked ? 0 : isSelected ? 10 : 1,
                }}
            >
                <div
                    className={styles.cardContent}
                    style={{
                        transform: `rotate(${-rotation}deg)`,
                    }}
                >
                    <div className={styles.cardAnimationWrapper}>
                        <StatCard
                            statName={statName}
                            statValue={baseStat}
                            isSelected={isSelected}
                            isLocked={isLocked}
                            onClick={() => onCardClick(index)}
                        />
                    </div>
                </div>
            </div>
        );
    }
);

export default CardWrapper;
