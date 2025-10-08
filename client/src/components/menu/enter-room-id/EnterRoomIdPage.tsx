import { useState, useEffect, use } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import { Pages } from "../../../constants/constants";
import { isValidRoomId } from "../../../../../shared/utils/validation";
import HomeLayout from "../layout/HomeLayout";
import RoomIdInput from "./RoomIdInput";
import SubmitButton from "./SubmitButton";
import styles from "./EnterRoomIdPage.module.css";
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
 * <EnterRoomIdPage />
 */
export default function EnterRoomIdPage() {
    const { sendJoinRoom, viewRoom } = useSocket();
    const { handleNavigate } = useNavigationContext();
    const [roomId, setRoomId] = useState("");
    const [isRoomIdValid, setIsRoomIdValid] = useState(false);

    // useEffect(() => {
    //     // Note: This should rarely happen, as name validation is already performed client-side.
    //     if (nameErrorSignal) {
    //         handleNavigate(Pages.HOME);
    //         setNameErrorSignal(false);
    //         alert("Invalid name. Make sure your name is between 4 and 9 characters long");
    //     }
    // }, [nameErrorSignal, handleNavigate, setNameErrorSignal]);

    // useEffect(() => {
    //     if (hasPassedValidRoomIdCheck) {
    //         handleNavigate(Pages.ROOM_OPTIONS, false);
    //         setHasPassedValidRoomIdCheck(false);
    //     }
    // }, [hasPassedValidRoomIdCheck, handleNavigate]);

    useEffect(() => {
        if (viewRoom) {
            handleNavigate(Pages.ROOM, false);
        }
    }, [viewRoom, handleNavigate]);

    function handleSubmit() {
        if (!isValidRoomId(roomId)) {
            return;
        }
        sendJoinRoom(roomId);
    }

    return (
        <HomeLayout>
            <div className={styles.inputSection}>
                <div className={styles.mainContent}>
                    <RoomIdInput
                        roomId={roomId}
                        setRoomId={setRoomId}
                        isRoomIdValid={isRoomIdValid}
                        setIsRoomIdValid={setIsRoomIdValid}
                    />
                </div>
                <SubmitButton isRoomIdValid={isRoomIdValid} handleSubmit={handleSubmit} />
            </div>
        </HomeLayout>
    );
}
