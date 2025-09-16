import styles from "./Countdown.module.css";

type CountdownProps = {
    count: number;
};

/**
 * Displays a large, animated countdown number.
 *
 * This component is used to show a countdown at the beginning the battle phase.
 * It renders nothing if the count is zero or less.
 *
 * @example
 * <Countdown count={3} />
 */
export default function Countdown({ count }: CountdownProps) {
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