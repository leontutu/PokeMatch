import styles from "./VictoryPage.module.scss";
import { useSocket } from "../../../contexts/SocketContext";
import { Pages } from "../../../constants/constants";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { UI_TEXT } from "../../../constants/uiText";

/**
 * Renders the victory screen after a match concludes.
 *
 * This component displays the winner's name and the final scores for both players.
 * It provides a "Return to Menu" button that navigates the user back to the
 * home page and signals the server to leave the room.
 *
 * @example
 * <VictoryPage />
 */
export default function VictoryPage() {
    const { viewRoom, sendLeaveRoom } = useSocket();
    const { handleNavigate } = useNavigationContext();
    const handleMenuButtonClick = () => {
        handleNavigate(Pages.HOME, true);
        sendLeaveRoom();
    };

    if (!viewRoom?.viewGame?.winner) {
        return null;
    }

    return (
        <div className={styles.victoryContainer}>
            <div className={styles.mainContent}>
                <h1 className={styles.winnerMessage}>
                    {UI_TEXT.MESSAGES.WINNER_ANNOUNCEMENT(viewRoom.viewGame.winner)}
                </h1>

                <div className={styles.scoresContainer}>
                    <p className={styles.score}>
                        {`${viewRoom.viewGame.you.name}: ${viewRoom.viewGame.you.points}`}
                    </p>
                    <p className={styles.score}>
                        {`${viewRoom.viewGame.opponent.name}: ${viewRoom.viewGame.opponent.points}`}
                    </p>
                </div>
            </div>

            <div className={styles.footer}>
                <button className={styles.menuButton} onClick={handleMenuButtonClick}>
                    {UI_TEXT.BUTTONS.RETURN_TO_MENU}
                </button>
            </div>
        </div>
    );
}
