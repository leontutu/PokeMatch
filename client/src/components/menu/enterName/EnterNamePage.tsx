import { useState, useEffect } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import { Pages } from "../../../constants/constants";
import { isValidName } from "../../../../../shared/utils/validation";
import HomeLayout from "../layout/HomeLayout";
import NameInput from "./NameInput";
import SubmitButton from "./SubmitButton";
import styles from "./EnterNamePage.module.css";
import { useNavigationContext } from "../../../contexts/NavigationContext";

/**
 * Renders the UI for entering a player's name before joining a room.
 *
 * This component manages the state for the name input and its validation.
 * It interacts with the socket context to submit the name to the server.
 * Based on the server's response, it will either navigate the user to the
 * game room or display an error and return them to the home page.
 *
 * @example
 * <EnterNamePage />
 */
export default function EnterNamePage() {
    const { sendName, viewRoom, nameErrorSignal, setNameErrorSignal } = useSocket();
    const { handleNavigate } = useNavigationContext();
    const [name, setName] = useState("");
    const [isNameValid, setIsNameValid] = useState(false);

    useEffect(() => {
        // Note: This should rarely happen, as name validation is already performed client-side.
        if (nameErrorSignal) {
            handleNavigate(Pages.HOME);
            setNameErrorSignal(false);
            alert("Invalid name. Make sure your name is between 4 and 9 characters long");
        }
    }, [nameErrorSignal, handleNavigate, setNameErrorSignal]);

    useEffect(() => {
        if (viewRoom) {
            handleNavigate(Pages.ROOM, false);
        }
    }, [viewRoom, handleNavigate]);

    function handleSubmit() {
        if (!isValidName(name)) {
            return;
        }
        sendName(name);
    }

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
                <SubmitButton isNameValid={isNameValid} handleSubmit={handleSubmit} />
            </div>
        </HomeLayout>
    );
}
