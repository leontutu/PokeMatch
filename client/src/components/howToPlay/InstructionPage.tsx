import InstructionItem from "./InstructionItem";
import styles from "./InstructionPage.module.css";

export default function InstructionPage() {
    return (
        <div className={styles.outerContainer}>
            <InstructionItem></InstructionItem>
            <div className={styles.footer}>
                <button className={styles.backButton}>Back to Home</button>
                <span className={styles.pageIndicator}>1 / 3</span>
            </div>
        </div>
    );
}
