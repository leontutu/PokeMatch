import styles from "./SelectStatPage.module.css";

export default function CardBody({
    statName,
    baseStat,
    animationDelay,
    isSelected,
    index,
    onCardClick,
    isLocked,
}) {
    return (
        <div
            className={`${styles.statDiv} 
                ${isLocked ? styles.lockedCard : ""}
                ${isSelected ? styles.highlight : ""}
                `}
            style={{ "--animation-delay": animationDelay }}
            onClick={() => {
                onCardClick(index);
            }}
        >
            <span className={styles.statName}>{statName}</span>
            <span className={styles.statValue}>{baseStat}</span>
        </div>
    );
}
