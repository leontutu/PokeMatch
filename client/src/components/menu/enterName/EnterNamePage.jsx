/**
 * EnterNamePage Component
 *
 * Renders the UI for entering a player's name before joining a room.
 * Handles local state for the name input and its validation, and interacts
 * with the socket context to submit the name and navigate based on server responses.
 *
 * Behavior:
 * - Validates the entered name using shared validation logic.
 * - Submits the name to the server via socket when valid.
 * - Navigates to the home page and shows an alert if the server signals a name error.
 * - Navigates to the room page when the server signals a successful room join.
 *
 * Usage:
 * <EnterNamePage onNavigate={yourNavigateFunction} />
 */

import { useState, useEffect } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import { PAGES } from "../../../constants";
import { isValidName } from "../../../../../shared/validation";
import HomeLayout from "../layout/HomeLayout";
import NameInput from "./NameInput";
import SubmitButton from "./SubmitButton";
import styles from "./EnterNamePage.module.css";

/**
 * EnterNamePage functional component.
 * @param {Object} props
 * @param {Function} props.onNavigate - Function to handle navigation between pages.
 */
export default function EnterNamePage({ onNavigate }) {
    // --- Socket and State ---
    const { sendName, roomState, nameErrorSignal, setNameErrorSignal } =
        useSocket();

    const [name, setName] = useState("");
    const [isNameValid, setIsNameValid] = useState(false);

    // --- Effects ---
    useEffect(() => {
        // This should rarely happen, as name validation is performed client-side.
        // If it does, it means the server rejected the name for some reason.
        if (nameErrorSignal) {
            onNavigate(PAGES.HOME);
            setNameErrorSignal(false);
            alert(
                "Invalid name. Make sure your name is between 4 and 9 characters long"
            );
        }
    }, [nameErrorSignal, onNavigate, setNameErrorSignal]);

    useEffect(() => {
        if (roomState) {
            onNavigate(PAGES.ROOM, false);
        }
    }, [roomState, onNavigate]);

    // --- Handlers ---
    /**
     * Handles the submission of the name input.
     * Validates the name and sends it to the server if valid.
     */
    function handleSubmit() {
        if (!isValidName(name)) {
            return;
        }
        sendName(name);
    }

    // --- Render ---
    return (
        <HomeLayout>
            <div className={styles.inputSection}>
                <div className={styles.mainContent}>
                    <NameInput
                        name={name}
                        setName={setName}
                        isNameValid={isNameValid}
                        setIsNameValid={setIsNameValid}
                    />
                </div>
                <SubmitButton
                    isNameValid={isNameValid}
                    handleSubmit={handleSubmit}
                />
            </div>
        </HomeLayout>
    );
}
