import styles from "./SubmitButton.module.scss";
import { UI_TEXT } from "../../../constants/uiText";

type SubmitButtonProps = {
    isNameValid: boolean;
    handleSubmit: () => void;
};

/**
 * Renders a styled submit button for the name entry form.
 * The button's `disabled` state and active styling are controlled by the `isNameValid` prop.
 * It calls the `handleSubmit` function when clicked.
 */
export default function SubmitButton({ isNameValid, handleSubmit }: SubmitButtonProps) {
    return (
        <div className={styles.buttonContainer}>
            <button
                className={`${styles.submitBtn} ${isNameValid ? styles.active : ""}`}
                onClick={handleSubmit}
                disabled={!isNameValid}
            >
                {UI_TEXT.BUTTONS.SUBMIT}
            </button>
        </div>
    );
}
