import styles from "./BattlePage.module.css";
import MatchLayout from "../layout/MatchLayout";
import { useState, useEffect } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import { useBattleLogic } from "../../../hooks/useBattleLogic";
import PokemonDisplay from "./PokemonDisplay";
import BattleGrid from "./BattleGrid";
import Countdown from "./Countdown";
import { NavigationHandler } from "../../../types";

type BattlePageProps = {
    onNavigate: NavigationHandler;
};

/**
 * Orchestrates the battle phase of the game.
 *
 * This component displays a countdown, followed by the reveal of both players'
 * chosen stats and the battle outcome. It uses the `useBattleLogic` hook to
 * compute results and composes smaller components to build the UI.
 *
 * @example
 * <BattlePage onNavigate={handleNavigation} />
 */
export default function BattlePage({ onNavigate }: BattlePageProps) {
    const { roomState } = useSocket();
    const [displayState, setDisplayState] = useState(roomState);
    const [isRevealed, setIsRevealed] = useState(false);
    const [countdown, setCountdown] = useState(5);
    
    if (!roomState || !roomState.game || !displayState || !displayState.game) {
        return <>Loading...</>;
    }
    const battleStats = useBattleLogic(displayState.game);
    if (!battleStats) {
        return <>Loading...</>;
    }


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
        if (!roomState || !roomState.game) return;
        if (
            roomState.game.you.challengeStat &&
            roomState.game.you.challengedStat.name
        ) {
            setDisplayState(roomState);
        }
    }, [roomState]);

    return (
        <MatchLayout onNavigate={onNavigate}>
            <div className={styles.outerContainer}>
                <PokemonDisplay
                    pokemonName={battleStats.opponentPokemon.name}
                    imageUrl={battleStats.opponentPokemonImgUrl}
                    isOpponent
                />

                <div className={styles.battleSection}>
                    <Countdown count={countdown} />
                    <BattleGrid isRevealed={isRevealed} stats={battleStats} />
                </div>

                <PokemonDisplay
                    pokemonName={battleStats.yourPokemon.name}
                    imageUrl={battleStats.yourPokemonImgUrl}
                />
            </div>
        </MatchLayout>
    );
}
