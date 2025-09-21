import BattleColumns from "./BattleColumns";
import StatBubble from "./StatBubble";
import styles from "./BattleField.module.css";
import { BattleStats } from "../../../types";

type BattleFieldProps = {
    battleStats: BattleStats;
    yourBattle: boolean;
    setColumnsFinished: (n: number) => void;
};

export default function BattleField({
    battleStats,
    yourBattle,
    setColumnsFinished: setBattleFinished,
}: BattleFieldProps) {
    if (!battleStats) return <>Loading...</>;
    return (
        <>
            <BattleColumns
                setColumnsFinished={setBattleFinished}
                yourValue={
                    yourBattle
                        ? battleStats.yourChallengeStat.value
                        : battleStats.yourChallengedStat.value
                }
                opponentValue={
                    yourBattle
                        ? battleStats.opponentChallengedStat.value
                        : battleStats.opponentChallengeStat.value
                }
            />
            <StatBubble
                label={
                    yourBattle
                        ? battleStats.yourChallengeStat.name.toUpperCase()
                        : battleStats.yourChallengedStat.name.toUpperCase()
                }
                flipped={!yourBattle}
                className={yourBattle ? styles.youStatBubble : styles.opponentStatBubble}
            />
        </>
    );
}

// {
/* <StatBubble
    label={roomState.game.opponent.challengeStat.name.toUpperCase()}
    flipped={true}
    className={`${styles.opponentStatBubble} ${isPhase2 ? "" : styles.hidden}`}
/> */
// }
