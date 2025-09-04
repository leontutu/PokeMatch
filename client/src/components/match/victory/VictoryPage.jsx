/**
 * VictoryPage Component
 *
 * Displays the victory screen after a match concludes, showing the winner and both players' scores.
 * Provides a button to return to the main menu and leave the room.
 * Uses styling from VictoryPage.module.css for layout and appearance.
 */

import styles from "./VictoryPage.module.css";
import { useSocket } from "../../../contexts/SocketContext";
import { PAGES } from "../../../constants";

/**
 * VictoryPage functional component.
 * @param {Object} props
 * @param {Function} props.onNavigate - Function to handle navigation between pages.
 * @returns {JSX.Element} The VictoryPage component.
 */
export default function VictoryPage({ onNavigate }) {
    const { roomState, sendLeaveRoom } = useSocket();

    const handleMenuButtonClick = () => {
        onNavigate(PAGES.HOME, true);
        sendLeaveRoom();
    };

    // A guard clause in case the component renders before the game state is settled.
    if (!roomState?.game?.winner) {
        return null;
    }

    return (
        <div className={styles.victoryContainer}>
            <div className={styles.mainContent}>
                <h1 className={styles.winnerMessage}>
                    {`${roomState.game.winner} won!`}
                </h1>

                <div className={styles.scoresContainer}>
                    <p className={styles.score}>
                        {`${roomState.game.you.name}: ${roomState.game.you.points}`}
                    </p>
                    <p className={styles.score}>
                        {`${roomState.game.opponent.name}: ${roomState.game.opponent.points}`}
                    </p>
                </div>
            </div>

            <div className={styles.footer}>
                <button
                    className={styles.menuButton}
                    onClick={handleMenuButtonClick}
                >
                    Return to Menu
                </button>
            </div>
        </div>
    );
}
