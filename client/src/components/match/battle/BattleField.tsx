import BattleColumns from "./BattleColumns";
import StatBubble from "./StatBubble";
import styles from "./BattleField.module.css";
import { BattleStats } from "../../../types";
import { StatToDisplay } from "../../../constants/constants";

type BattleFieldProps = {
    battleStats: BattleStats;
    setColumnsFinished: (n: number) => void;
    yourBattle: boolean;
};

export default function BattleField({
    battleStats,
    setColumnsFinished,
    yourBattle,
}: BattleFieldProps) {
    if (!battleStats) return <>Loading...</>;
    return (
        <>
            <BattleColumns
                setColumnsFinished={setColumnsFinished}
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
                        ? StatToDisplay.get(battleStats.yourChallengeStat.name)
                        : StatToDisplay.get(battleStats.opponentChallengeStat.name)
                }
                flipped={!yourBattle}
                className={yourBattle ? styles.youStatBubble : styles.opponentStatBubble}
            />
        </>
    );
}
