import styles from "./ScoreBoard.module.css";
import { ViewGame } from "../../../../../shared/types/types";

type ScoreBoardProps = {
    viewGame: ViewGame;
    onHomeClick: () => void;
};

/**
 * Renders a scoreboard footer displaying player names and scores for the current match.
 *
 * This component shows the current player's (`you`) score on the left and the
 * opponent's score on the right. It also includes a central "home" button
 * to allow the user to leave the match.
 *
 * @example
 * <ScoreBoard viewGame={gameState} onHomeClick={handleGoHome} />
 */
export default function ScoreBoard({ viewGame, onHomeClick }: ScoreBoardProps) {
    const you = viewGame.you;
    const opponent = viewGame.opponent;

    return (
        <div className={styles.bottomSpansContainer}>
            <div className={styles.framedSpan}>
                <span>{you.name}</span>
                <span>{you.points}</span>
            </div>
            <button className={styles.homeButton} onClick={onHomeClick}>
                ☰
            </button>
            <div className={styles.framedSpan}>
                <span>{opponent.name}</span>
                <span>{opponent.points}</span>
            </div>
        </div>
    );
}
