import styles from "./LeaveConfirmDialog.module.css";

type LeaveConfirmationDialogProps = {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

/**
 * Renders a modal dialog to confirm if the user wants to leave the current match.
 *
 * When open, it overlays the screen and presents "Yes" and "No" options.
 * The `onConfirm` and `onCancel` callbacks are triggered accordingly.
 *
 * @example
 * <LeaveConfirmationDialog
 *   isOpen={isDialogOpen}
 *   onConfirm={handleLeave}
 *   onCancel={handleCloseDialog}
 * />
 */
export default function LeaveConfirmationDialog({
    isOpen,
    onConfirm,
    onCancel,
}: LeaveConfirmationDialogProps) {
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