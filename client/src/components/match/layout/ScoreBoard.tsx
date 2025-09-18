import styles from "./ScoreBoard.module.css";
import { GameState } from "../../../types";

type ScoreBoardProps = {
    game: GameState;
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
 * <ScoreBoard game={gameState} onHomeClick={handleGoHome} />
 */
export default function ScoreBoard({ game, onHomeClick }: ScoreBoardProps) {
    const you = game.you;
    const opponent = game.opponent;

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
