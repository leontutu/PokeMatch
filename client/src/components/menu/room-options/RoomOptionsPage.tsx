import HomeLayout from "../layout/HomeLayout";
import styles from "./RoomOptionsPage.module.scss";
import { useSocket } from "../../../contexts/SocketContext.real";
import { useEffect } from "react";
import { Pages } from "../../../constants/constants";
import { useNavigationContext } from "../../../contexts/NavigationContext";

/**
 * Renders the room options page where users can choose to create a room,
 * join an existing room, or play against a bot.
 *
 * This component provides the primary navigation choices for starting a game.
 * It handles the UI for these options and triggers the corresponding actions,
 * such as creating a room on the server or navigating to the "Enter Room ID" page.
 *
 * @returns {JSX.Element} The rendered room options page.
 */
export default function RoomOptionsPage() {
    const { sendCreateRoom, sendPlayVsBot, viewRoom } = useSocket();
    const { handleNavigate } = useNavigationContext();

    const handleCreateRoomClick = () => {
        sendCreateRoom();
    };

    const handleJoinRoomClick = () => {
        handleNavigate(Pages.ENTER_ROOM_ID, false);
    };

    const handlePlayVsBotClick = () => {
        sendPlayVsBot();
    };

    useEffect(() => {
        if (viewRoom) {
            handleNavigate(Pages.ROOM, false);
        }
    }, [viewRoom, handleNavigate]);

    return (
        <HomeLayout>
            <div className={styles.buttonColumn}>
                <div className={styles.buttonContainer}>
                    <button className={styles.createRoomBtn} onClick={handleCreateRoomClick}>
                        <span>Create Room</span>
                    </button>
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.joinRoomBtn} onClick={handleJoinRoomClick}>
                        <span>Join Room</span>
                    </button>
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.playVsBotBtn} onClick={handlePlayVsBotClick}>
                        <span>Play vs Bot</span>
                    </button>
                </div>
            </div>
        </HomeLayout>
    );
}
