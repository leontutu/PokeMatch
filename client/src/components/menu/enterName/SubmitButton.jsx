/**
 * SubmitButton Component
 *
 * Renders a styled submit button for the name entry form.
 * The button is enabled only when the entered name is valid.
 *
 * Props:
 * - isNameValid (boolean): Determines if the button should be enabled and styled as active.
 * - handleSubmit (function): Called when the button is clicked to submit the name.
 *
 */

import React from "react";
import styles from "./SubmitButton.module.css";

/**
 * SubmitButton functional component.
 * @param {Object} props
 * @param {boolean} props.isNameValid - Whether the name input is valid.
 * @param {Function} props.handleSubmit - Function to handle submit action.
 */
export default function SubmitButton({ isNameValid, handleSubmit }) {
    return (
        <div className={styles.buttonContainer}>
            <button
                className={`${styles.submitBtn} ${
                    isNameValid ? styles.active : ""
                }`}
                onClick={handleSubmit}
                disabled={!isNameValid}
            >
                Submit
            </button>
        </div>
    );
}
