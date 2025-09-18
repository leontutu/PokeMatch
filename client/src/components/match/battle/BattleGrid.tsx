import styles from "./BattleGrid.module.css";
import StatCard from "../shared/StatCard";
import OutcomeSymbol from "./OutcomeSymbol";


type BattleGridProps = {
    isRevealed: boolean;
    stats: any; // note: any is fine, the parent component is scheduled for refactor already
};

/**
 * Renders the central grid for the battle screen.
 *
 * This grid shows the stat cards for both players and the outcome symbols
 * (win, loss, tie) for each stat challenge. The actual values are hidden
 * until `isRevealed` becomes true.
 *
 * @example
 * <BattleGrid
 *   isRevealed={isRevealed}
 *   stats={battleStats}
 * />
 */
export default function BattleGrid({ isRevealed, stats }: BattleGridProps) {
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