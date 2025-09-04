/**
 * NameInput Component
 *
 * Renders a labeled input field for entering a player's name.
 * Handles local validation and provides feedback to the user.
 * Scrolls the input into view on focus (useful for mobile keyboards).
 *
 */

import { useRef } from "react";
import styles from "./NameInput.module.css";
import { isValidName } from "../../../../../shared/validation";

/**
 * NameInput functional component.
 * @param {Object} props
 * @param {string} props.name - The current value of the name input.
 * @param {Function} props.setName - Function to update the name value.
 * @param {boolean} props.isNameValid - Whether the name is valid.
 * @param {Function} props.setIsNameValid - Function to update validity state.
 */
export default function NameInput({
    name,
    setName,
    isNameValid,
    setIsNameValid,
}) {
    const inputRef = useRef(null); // Create a ref for the input element

    // This function will be called when the user taps the input
    // The purpose is to scroll both the input and the submit button into view
    // when the keyboard is open
    const handleFocus = () => {
        // Timeout to wait for the keyboard opening animation to complete
        setTimeout(() => {
            inputRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 400);
    };

    function handleNameChange(event) {
        setName(event.target.value);
        setIsNameValid(isValidName(event.target.value));
    }

    let validationMessage = " ";
    if (name.length > 0) {
        validationMessage = isNameValid
            ? "Looks good!"
            : "3-9 chars | A-Z & 0-9";
    }

    return (
        <>
            <label htmlFor="name-input" className={styles.nameLabel}>
                Enter Your Name
            </label>
            <div className={`${styles.inputWrapper} `}>
                <input
                    ref={inputRef} // ref for scrolling into view
                    onFocus={handleFocus} // add the onFocus handler
                    id="name-input"
                    className={styles.nameInput}
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Your name here"
                    maxLength="9"
                />
                <span
                    className={`${styles.validationText} ${
                        isNameValid ? styles.valid : ""
                    }`}
                >
                    {validationMessage}
                </span>
            </div>
        </>
    );
}
