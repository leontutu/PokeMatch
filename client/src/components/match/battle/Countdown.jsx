import styles from "./Countdown.module.css";

/**
 * Countdown Component
 *
 * Displays a large, animated countdown number in the center of the screen.
 * It is used at the beginning of the battle phase.
 *
 * @param {object} props - The component props.
 * @param {number} props.count - The current number to display in the countdown.
 * @returns {JSX.Element|null} The Countdown component, or null if count is 0 or less.
 */
export default function Countdown({ count }) {
    if (count <= 0) {
        return null;
    }

    return (
        <div className={styles.countdownContainer}>
            <span key={count} className={styles.countdownNumber}>
                {count}
            </span>
        </div>
    );
}