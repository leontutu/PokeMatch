import styles from "./BattlePage.module.css";
import MatchLayout from "../layout/MatchLayout";
import { useSocket } from "../../../contexts/SocketContext";
import { useBattleLogic } from "../../../hooks/useBattleLogic";
import PokemonDisplay from "./PokemonDisplay";
import { NavigationHandler } from "../../../types";
import BattleField from "./BattleField";
import { useUIInfoContext } from "../../../contexts/UIInfoContext";
import { useBattleSequence } from "../../../hooks/useBattleSequence";
import { useEffect, useState } from "react";

type BattlePageProps = {
    onNavigate: NavigationHandler;
};

export default function BattlePage({ onNavigate }: BattlePageProps) {
    const { roomState, sendBattleEnd } = useSocket();
    const battleStats = useBattleLogic(roomState?.game);
    const { isWipingIn } = useUIInfoContext();
    const [activeBattle, setActiveBattle] = useState<1 | 2>(1);

    const { phase, setPhase, animation, isFading } = useBattleSequence(
        battleStats,
        sendBattleEnd,
        isWipingIn
    );

    useEffect(() => {
        if (phase === "BATTLE_2_START") {
            setActiveBattle(2);
        }
    }, [phase]);

    if (!roomState || !roomState.game || !battleStats) {
        return <>Loading...</>;
    }

    return (
        <MatchLayout onNavigate={onNavigate}>
            <div className={styles.outerContainer}>
                <PokemonDisplay
                    pokemonName={battleStats.opponentPokemon.name}
                    imageUrl={battleStats.opponentPokemonImgUrl}
                    animation={animation.opponent}
                    isOpponent={true}
                />
                <div className={styles.battleSectionWrapper}>
                    <div className={`${styles.battleSection} ${isFading ? styles.fadeOut : ""}`}>
                        <BattleField
                            key={activeBattle === 1 ? "battle-1" : "battle-2"}
                            yourBattle={
                                activeBattle === 1
                                    ? battleStats.isYouFirst
                                    : !battleStats.isYouFirst
                            }
                            battleStats={battleStats}
                            isWipingIn={isWipingIn}
                            onFinished={() =>
                                setPhase(activeBattle === 1 ? "BATTLE_1_END" : "BATTLE_2_END")
                            }
                        />
                    </div>
                </div>
                <PokemonDisplay
                    pokemonName={battleStats.yourPokemon.name}
                    imageUrl={battleStats.yourPokemonImgUrl}
                    animation={animation.you}
                    isOpponent={false}
                />
            </div>
        </MatchLayout>
    );
}
