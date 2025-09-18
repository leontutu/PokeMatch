import styles from "./StatCard.module.css";

type StatCardProps = {
    statName: string;
    statValue: number | string;
    isSelected?: boolean;
    isLocked?: boolean;
    onClick?: () => void;
};

/**
 * Renders a clickable card displaying a single Pokémon stat.
 *
 * This component visually indicates its state through styling:
 * - `isSelected`: Applies a highlight to show it's the current selection.
 * - `isLocked`: Applies a style to show the stat is no longer selectable.
 * It triggers an `onClick` callback when pressed.
 *
 * @example
 * <StatCard
 *   statName="⚔️ ATTACK"
 *   statValue={120}
 *   isSelected={true}
 *   isLocked={false}
 *   onClick={handleSelectStat}
 * />
 */
export default function StatCard({
    statName,
    statValue,
    isSelected = false,
    isLocked = false,
    onClick,
}: StatCardProps) {
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
