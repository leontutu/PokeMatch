import styles from "./StatCard.module.css";

export default function StatCard({ statName, statValue, onStatCardClick }) {
    return (
        <div
            className={styles.statCard}
            onClick={() => onStatCardClick(statName)}
        >
            <p className={styles.statName}>{statName}</p>
            <h3 className={styles.statValue}>{statValue}</h3>
        </div>
    );
}
