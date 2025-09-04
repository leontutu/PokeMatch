import styles from "./BattlePage.module.css";
import MatchLayout from "../layout/MatchLayout";
import { useState, useEffect } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import { useBattleLogic } from "../../../hooks/useBattleLogic";
import PokemonDisplay from "./PokemonDisplay";
import BattleGrid from "./BattleGrid";
import Countdown from "./Countdown";

/**
 * BattlePage Component
 *
 * Orchestrates the battle phase of the game. It displays a countdown,
 * followed by the reveal of both players' chosen stats and the battle outcome.
 * It uses the `useBattleLogic` hook to compute results and composes smaller
 * components (`PokemonDisplay`, `BattleGrid`, `Countdown`) to build the UI.
 *
 * @returns {JSX.Element} The BattlePage component.
 */
export default function BattlePage() {
    const { roomState } = useSocket();
    const [displayState, setDisplayState] = useState(roomState);
    const [isRevealed, setIsRevealed] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const battleStats = useBattleLogic(displayState.game);

    // This effect manages the countdown and the final reveal
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setIsRevealed(true);
        }
    }, [countdown]);

    // Ensures the display state doesn't change when stats are reset
    useEffect(() => {
        if (
            roomState.game.you.challengeStat &&
            roomState.game.you.challengedStat.name
        ) {
            setDisplayState(roomState);
        }
    }, [roomState]);

    if (!battleStats.yourPokemon.name) {
        return (
            <MatchLayout>
                <div>Loading...</div>
            </MatchLayout>
        );
    }

    return (
        <MatchLayout>
            <div className={styles.outerContainer}>
                <PokemonDisplay
                    pokemon={battleStats.opponentPokemon}
                    imageUrl={battleStats.opponentPokemonImgUrl}
                    isOpponent
                />

                <div className={styles.battleSection}>
                    <Countdown count={countdown} />
                    <BattleGrid isRevealed={isRevealed} stats={battleStats} />
                </div>

                <PokemonDisplay
                    pokemon={battleStats.yourPokemon}
                    imageUrl={battleStats.yourPokemonImgUrl}
                />
            </div>
        </MatchLayout>
    );
}
