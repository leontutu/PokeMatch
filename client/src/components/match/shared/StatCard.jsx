/**
 * StatCard Component
 *
 * Displays a stat name and value, with visual indication for selection and locking.
 * Uses styling from StatCard.module.css for appearance.
 */

import styles from "./StatCard.module.css";

/**
 * StatCard functional component.
 * @param {Object} props
 * @param {string} props.statName - The name of the stat.
 * @param {number|string} props.statValue - The value of the stat.
 * @param {boolean} props.isSelected - Whether the card is selected.
 * @param {boolean} props.isLocked - Whether the card is locked.
 * @param {function} props.onClick - Click handler for the card.
 */
export default function StatCard({
    statName,
    statValue,
    isSelected,
    isLocked,
    onClick,
}) {
    return (
        <div
            className={`${styles.statCard} 
                ${isLocked ? styles.locked : ""}
                ${isSelected ? styles.highlight : ""}
            `}
            onClick={onClick}
        >
            <span className={styles.statName}>{statName}</span>
            <span className={styles.statValue}>{statValue}</span>
        </div>
    );
}
