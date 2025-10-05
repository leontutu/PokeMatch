import styles from "./StatBubble.module.css";

type StatBubbleProps = {
    label: string | undefined;
    flipped?: boolean;
    className?: string;
};

/**
 * A presentational component that displays a stat name in a chat bubble.
 *
 * This is a simple visual component used to announce which stat is being
 * contested in a battle round. It can be flipped horizontally for use by
 * the opponent.
 *
 * @param label - The name of the stat to display (e.g., "Attack").
 * @param className - Optional CSS classes for positioning and animation.
 * @param flipped - A boolean to flip the component horizontally.
 *
 * @example
 * <StatBubble label="Attack" flipped={false} className="animate-in" />
 */

export default function StatBubble({ label, className, flipped }: StatBubbleProps) {
    return (
        <div className={`${styles.outerWrapper} ${className} ${flipped ? styles.flipped : ""}`}>
            <img className={styles.image} src="/graphics/game/chat-bubble.png" alt="Chat Bubble" />
            <div className={styles.innerWrapper}>
                <span className={`${styles.label} ${flipped ? styles.flipped : ""}`}>
                    {label?.slice(0, 2)}
                    <br />
                    {label?.slice(2)}
                </span>
            </div>
        </div>
    );
}
