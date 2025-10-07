import styles from "./InstructionItem.module.css";
export default function InstructionItem() {
    return (
        <div className={styles.outerContainer}>
            <div className={styles.headerSection}>Header</div>
            <div className={styles.imageSection}>Image</div>
            <div className={styles.instructionsSection}>Instructions</div>
        </div>
    );
}
