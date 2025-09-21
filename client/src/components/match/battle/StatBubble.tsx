import styles from "./StatBubble.module.css";
type StatBubbleProps = {
    label: string;
    className?: string;
};

export default function StatBubble({ label, className }: StatBubbleProps) {
    return (
        <div className={`${styles.outerWrapper} ${className}`}>
            <img className={styles.image} src="/chat-bubble.png" alt="Chat Bubble" />
            <div className={styles.innerWrapper}>
                <div className={styles.label}>{label}</div>
            </div>
        </div>
    );
}
