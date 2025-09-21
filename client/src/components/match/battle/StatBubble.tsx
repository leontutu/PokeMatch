import styles from "./StatBubble.module.css";
type StatBubbleProps = {
    label: string;
    flipped?: boolean;
    className?: string;
};

export default function StatBubble({ label, className, flipped }: StatBubbleProps) {
    return (
        <div className={`${styles.outerWrapper} ${className} ${flipped ? styles.flipped : ""}`}>
            <img className={styles.image} src="/chat-bubble.png" alt="Chat Bubble" />
            <div className={styles.innerWrapper}>
                <div className={`${styles.label} ${flipped ? styles.flipped : ""}`}>{label}</div>
            </div>
        </div>
    );
}
