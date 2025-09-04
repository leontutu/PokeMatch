import styles from "./OutcomeSymbol.module.css";

/**
 * OutcomeSymbol Component
 *
 * Displays a symbol indicating the result of a stat challenge (Win, Loss, or Tie).
 * The symbol and its color change based on the outcome.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isRevealed - If true, the symbol is visible and animated.
 * @param {boolean} props.isTie - If true, displays the tie symbol.
 * @param {boolean} props.isWin - If true, displays the win symbol; otherwise, the loss symbol.
 * @param {boolean} [props.isPlayerTwo=false] - If true, inverts the win/loss logic for the opponent's perspective.
 * @returns {JSX.Element} The OutcomeSymbol component.
 */
export default function OutcomeSymbol({
    isRevealed,
    isTie,
    isWin,
    isPlayerTwo = false,
}) {
    const getOutcomeClass = () => {
        if (isTie) return styles.tie;
        const didWin = isPlayerTwo ? !isWin : isWin;
        return didWin ? styles.win : styles.loss;
    };

    const getOutcomeSymbol = () => {
        if (isTie) return "=";
        const didWin = isPlayerTwo ? !isWin : isWin;
        return didWin ? "∧" : "∨";
    };

    return (
        <div className={styles.symbolContainer}>
            <span
                className={`${styles.symbol} ${getOutcomeClass()} ${
                    isRevealed ? styles.revealed : ""
                }`}
            >
                {getOutcomeSymbol()}
            </span>
        </div>
    );
}
