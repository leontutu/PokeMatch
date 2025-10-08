import HomeLayout from "../layout/HomeLayout";
import styles from "./RoomOptionsPage.module.css";

export default function RoomOptionsPage() {
    const handleCreateRoomClick = () => {
        // handleNavigate(Pages.ENTER_NAME, false);
    };

    const handleJoinRoomClick = () => {
        // handleNavigate(Pages.ENTER_ROOM_ID, false);
    };

    const handlePlayVsBotClick = () => {
        // handleNavigate(Pages.ENTER_NAME, false);
    };

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
