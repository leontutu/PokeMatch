/**
 * ScoreBoard Component
 *
 * Displays the current score and names for both players in a match.
 * Sits at the bottom of the viewport as a footer.
 * Uses styling from ScoreBoard.module.css for layout and appearance.
 */

import styles from "./ScoreBoard.module.css";

/**
 * ScoreBoard functional component.
 * @param {Object} props
 * @param {Object} props.game - The current game state.
 * @param {Function} props.onHomeClick - Callback for when the home button is clicked.
 * @returns {JSX.Element} The ScoreBoard component.
 */
export default function ScoreBoard({ game, onHomeClick }) {
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
