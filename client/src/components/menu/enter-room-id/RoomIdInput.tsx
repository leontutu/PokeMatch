import { useRef } from "react";
import styles from "./RoomIdInput.module.scss";
import { isValidRoomId } from "../../../../../shared/utils/validation";
import { UI_TEXT } from "../../../constants/uiText";

type RoomIdInputProps = {
    roomId: string;
    setRoomId: (roomId: string) => void;
    isRoomIdValid: boolean;
    setIsRoomIdValid: (isValid: boolean) => void;
};

/**
 * Renders a labeled input field for entering a player's room ID.
 * Handles local validation and provides visual feedback to the user.
 * Automatically scrolls the input into view on focus to improve user experience
 * on mobile devices where a virtual keyboard may cover the input.
 */
export default function RoomIdInput({
    roomId,
    setRoomId,
    isRoomIdValid,
    setIsRoomIdValid,
}: RoomIdInputProps) {
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

    function handleRoomIdChange(event: React.ChangeEvent<HTMLInputElement>) {
        setRoomId(event.target.value);
        setIsRoomIdValid(isValidRoomId(event.target.value));
    }

    let validationMessage = " ";
    if (roomId.length > 0) {
        validationMessage = isRoomIdValid
            ? UI_TEXT.VALIDATION.LOOKS_GOOD
            : UI_TEXT.VALIDATION.ROOM_ID_REQUIREMENTS;
    }

    return (
        <>
            <label htmlFor="room-id-input" className={styles.nameLabel}>
                {UI_TEXT.LABELS.ENTER_ROOM_ID}
            </label>
            <div className={`${styles.inputWrapper} `}>
                <input
                    ref={inputRef}
                    onFocus={handleFocus}
                    id="room-id-input"
                    className={styles.nameInput}
                    type="text"
                    value={roomId}
                    onChange={handleRoomIdChange}
                    placeholder={UI_TEXT.PLACEHOLDERS.ROOM_ID_HERE}
                    maxLength={9}
                />
                <span className={`${styles.validationText} ${isRoomIdValid ? styles.valid : ""}`}>
                    {validationMessage}
                </span>
            </div>
        </>
    );
}
