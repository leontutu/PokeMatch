import styles from "./SelectStatPage.module.scss";

export default function CardBody({
    statName,
    baseStat,
    animationDelay,
    isSelected,
    index,
    onCardClick,
    isLocked,
}: any) {
    return (
        <div
            className={`${styles.statDiv} 
                ${isLocked ? styles.lockedCard : ""}
                ${isSelected ? styles.highlight : ""}
                `}
            style={{ "--animation-delay": animationDelay } as React.CSSProperties}
            onClick={() => {
                onCardClick(index);
            }}
        >
            <span className={styles.statName}>{statName}</span>
            <span className={styles.statValue}>{baseStat}</span>
        </div>
    );
}
