import styles from "./StatBubble.module.css";
type StatBubbleProps = {
    label: string | undefined;
    flipped?: boolean;
    className?: string;
};

export default function StatBubble({ label, className, flipped }: StatBubbleProps) {
    return (
        <div className={`${styles.outerWrapper} ${className} ${flipped ? styles.flipped : ""}`}>
            <img className={styles.image} src="/chat-bubble.png" alt="Chat Bubble" />
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
