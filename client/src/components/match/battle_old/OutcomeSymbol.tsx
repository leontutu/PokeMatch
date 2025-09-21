import styles from "./OutcomeSymbol.module.css";


type OutcomeSymbolProps = {
    isRevealed: boolean;
    isTie: boolean;
    isWin: boolean;
    isPlayerTwo?: boolean;
};
/**
 * Displays a symbol indicating the result of a stat challenge (Win, Loss, or Tie).
 *
 * When revealed, it shows a symbol ("∧" for win, "∨" for loss, "=" for tie)
 * with a corresponding color. The `isPlayerTwo` prop inverts the win/loss
 * logic for the opponent's perspective.
 *
 * @example
 * <OutcomeSymbol
 *   isRevealed={true}
 *   isTie={false}
 *   isWin={true}
 * />
 */
export default function OutcomeSymbol({
    isRevealed,
    isTie,
    isWin,
    isPlayerTwo = false,
}: OutcomeSymbolProps) {
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
