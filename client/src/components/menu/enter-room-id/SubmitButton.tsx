import styles from "./SubmitButton.module.scss";

type SubmitButtonProps = {
    isRoomIdValid: boolean;
    handleSubmit: () => void;
};

/**
 * Renders a styled submit button for the roomId entry form.
 * The button's `disabled` state and active styling are controlled by the `isRoomIdValid` prop.
 * It calls the `handleSubmit` function when clicked.
 */
export default function SubmitButton({ isRoomIdValid, handleSubmit }: SubmitButtonProps) {
    return (
        <div className={styles.buttonContainer}>
            <button
                className={`${styles.submitBtn} ${isRoomIdValid ? styles.active : ""}`}
                onClick={handleSubmit}
                disabled={!isRoomIdValid}
            >
                Submit
            </button>
        </div>
    );
}
