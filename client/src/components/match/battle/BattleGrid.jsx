import styles from "./BattleGrid.module.css";
import StatCard from "../shared/StatCard";
import OutcomeSymbol from "./OutcomeSymbol";

/**
 * BattleGrid Component
 *
 * Renders the central grid of the battle screen, showing the stat cards for both
 * players and the outcome symbols (win, loss, tie) for each challenge.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isRevealed - Whether to show the actual stat values and outcomes.
 * @param {object} props.stats - An object containing all computed stat and outcome data from `useBattleLogic`.
 * @returns {JSX.Element} The BattleGrid component.
 */
export default function BattleGrid({ isRevealed, stats }) {
    const {
        opponentChallengedStat,
        opponentChallengeStat,
        yourChallengeStat,
        yourChallengedStat,
        opponentChallengedStatDisplay,
        opponentChallengeStatDisplay,
        yourChallengeStatDisplay,
        yourChallengedStatDisplay,
        isOpponentChallengeTie,
        opponentChallengeOutcome,
        isYourChallengeTie,
        yourChallengeOutcome,
    } = stats;

    return (
        <div className={styles.statCardGrid}>
            {/* Opponent's Row */}
            <StatCard
                statName={opponentChallengedStatDisplay}
                statValue={isRevealed ? opponentChallengedStat.value : "?"}
            />
            <StatCard
                statName={opponentChallengeStatDisplay}
                statValue={isRevealed ? opponentChallengeStat.value : "?"}
            />

            {/* Outcome Symbols Row */}
            <OutcomeSymbol
                isRevealed={isRevealed}
                isTie={isOpponentChallengeTie}
                isWin={opponentChallengeOutcome}
                isPlayerTwo
            />
            <OutcomeSymbol
                isRevealed={isRevealed}
                isTie={isYourChallengeTie}
                isWin={yourChallengeOutcome}
            />

            {/* Your Row */}
            <StatCard
                statName={yourChallengeStatDisplay}
                statValue={isRevealed ? yourChallengeStat.value : "?"}
            />
            <StatCard
                statName={yourChallengedStatDisplay}
                statValue={isRevealed ? yourChallengedStat.value : "?"}
            />
        </div>
    );
}