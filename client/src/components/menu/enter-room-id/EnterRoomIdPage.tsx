import { useState, useEffect } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import { Pages } from "../../../constants/constants";
import { isValidRoomId } from "../../../../../shared/utils/validation";
import HomeLayout from "../layout/HomeLayout";
import RoomIdInput from "./RoomIdInput";
import SubmitButton from "./SubmitButton";
import styles from "./EnterRoomIdPage.module.scss";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { UI_TEXT } from "../../../constants/uiText";

/**
 * Renders the UI for entering a player's roomId before joining a room.
 *
 * This component manages the state for the roomId input and its validation.
 * It interacts with the socket context to submit the roomId to the server.
 * Based on the server's response, it will either navigate the user to the
 * game room or display an error and return them to the room options page.
 *
 * @example
 * <EnterRoomIdPage />
 */
export default function EnterRoomIdPage() {
    const { sendJoinRoom, viewRoom, badRoomIdSignal, setBadRoomIdSignal } = useSocket();
    const { handleNavigate } = useNavigationContext();
    const [roomId, setRoomId] = useState("");
    const [isRoomIdValid, setIsRoomIdValid] = useState(false);

    useEffect(() => {
        if (badRoomIdSignal) {
            handleNavigate(Pages.ROOM_OPTIONS, false);
            setBadRoomIdSignal(false);
            alert(UI_TEXT.ALERTS.ROOM_NOT_FOUND(roomId));
        }
    }, [badRoomIdSignal, handleNavigate, setBadRoomIdSignal]);

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
