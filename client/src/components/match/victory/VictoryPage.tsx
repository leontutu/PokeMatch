import styles from "./VictoryPage.module.css";
import { useSocket } from "../../../contexts/SocketContext";
import { PAGES } from "../../../constants/constants";
import { NavigationHandler } from "../../../types";

type VictoryPageProps = {
    onNavigate: NavigationHandler;
};

/**
 * Renders the victory screen after a match concludes.
 *
 * This component displays the winner's name and the final scores for both players.
 * It provides a "Return to Menu" button that navigates the user back to the
 * home page and signals the server to leave the room.
 *
 * @example
 * <VictoryPage onNavigate={handleNavigation} />
 */
export default function VictoryPage({ onNavigate }: VictoryPageProps) {
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
