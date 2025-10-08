import HomeLayout from "../layout/HomeLayout";
import styles from "./RoomOptionsPage.module.css";
import { useSocket } from "../../../contexts/SocketContext.real";
import { useEffect } from "react";
import { Pages } from "../../../constants/constants";
import { useNavigationContext } from "../../../contexts/NavigationContext";

export default function RoomOptionsPage() {
    const { sendCreateRoom, sendPlayVsBot, viewRoom } = useSocket();
    const { handleNavigate } = useNavigationContext();

    const handleCreateRoomClick = () => {
        sendCreateRoom();
    };

    const handleJoinRoomClick = () => {
        // navigate to another page?
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
