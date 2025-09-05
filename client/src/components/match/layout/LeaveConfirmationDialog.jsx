import styles from "./LeaveConfirmDialog.module.css";

/**
 * A modal dialog to confirm if the user wants to leave the match.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - If true, the dialog is shown.
 * @param {function} props.onConfirm - Callback for when the "Yes" button is clicked.
 * @param {function} props.onCancel - Callback for when the "No" button is clicked.
 * @returns {JSX.Element|null}
 */
export default function LeaveConfirmationDialog({
    isOpen,
    onConfirm,
    onCancel,
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <p className={styles.message}>
                    Leave room and return to main menu?
                </p>
                <div className={styles.buttonGroup}>
                    <button
                        onClick={onConfirm}
                        className={`${styles.button} ${styles.yesButton}`}
                    >
                        Yes
                    </button>
                    <button
                        onClick={onCancel}
                        className={`${styles.button} ${styles.noButton}`}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}
