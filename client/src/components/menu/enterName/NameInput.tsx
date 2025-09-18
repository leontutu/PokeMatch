import { useRef } from "react";
import styles from "./NameInput.module.css";
import { isValidName } from "../../../../../shared/utils/validation";

type NameInputProps = {
    name: string;
    setName: (name: string) => void;
    isNameValid: boolean;
    setIsNameValid: (isValid: boolean) => void;
};

/**
 * Renders a labeled input field for entering a player's name.
 * Handles local validation and provides visual feedback to the user.
 * Automatically scrolls the input into view on focus to improve user experience
 * on mobile devices where a virtual keyboard may cover the input.
 */
export default function NameInput({
    name,
    setName,
    isNameValid,
    setIsNameValid,
}: NameInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    // Function to scroll the input into view when the keyboard is open
    const handleFocus = () => {
        // Timeout to wait for the keyboard opening animation to complete
        // hack: Many devices will open the keyboard and subsequently open an autofill
        // widget above it that can cover the input field. 400ms seems to be a good compromise.
        setTimeout(() => {
            inputRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 400);
    };

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
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
                    ref={inputRef}
                    onFocus={handleFocus}
                    id="name-input"
                    className={styles.nameInput}
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Your name here"
                    maxLength={9}
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
