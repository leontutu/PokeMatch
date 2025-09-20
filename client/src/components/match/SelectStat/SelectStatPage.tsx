import { useState, useEffect } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import styles from "./SelectStatPage.module.css";
import MatchLayout from "../layout/MatchLayout";
import TypeCard from "./TypeCard";
import cardScaffold from "../../../scaffolds/cardScaffold";
import CardWrapper from "./CardWrapper";
import { DISPLAY_TO_STAT } from "../../../constants/constants";
import { STAT_NAMES } from "../../../../../shared/constants/constants";
import { NavigationHandler } from "../../../types";
import { useSound } from "use-sound";

type SelectStatPageProps = {
    onNavigate: NavigationHandler;
};

/**
 * Renders the stat selection screen for the match.
 *
 * This component displays a radial layout of stat cards for the player's Pokémon.
 * It allows the player to select a stat to challenge, lock in their choice, and
 * provides visual feedback for previously used stats and the current selection.
 * NOTE: This component's implementation is very hacky and will be rewritten from scratch soon™
 *
 * @example
 * <SelectStatPage onNavigate={handleNavigation} />
 */
export default function SelectStatPage({ onNavigate }: SelectStatPageProps) {
    const { roomState, sendSelectStat } = useSocket();
    const { selectStatErrorSignal, setSelectStatErrorSignal } = useSocket();
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [buttonState, setButtonState] = useState(false);
    const [lockedIn, setLockedIn] = useState(false);

    const [playSelect] = useSound(`/select.mp3`, {
        volume: 1,
    });

    const [playConfirm] = useSound(`/confirm.mp3`, {
        volume: 1,
    });

    useEffect(() => {
        setButtonState(!lockedIn && selectedCardIndex !== null);
    }, [selectedCardIndex, lockedIn]);

    useEffect(() => {
        if (selectStatErrorSignal) {
            alert("[Server]: You selected an already locked stat.");
            setButtonState(false);
            setLockedIn(false);
            setSelectedCardIndex(null);
            setSelectStatErrorSignal(false);
        }
    }, [selectStatErrorSignal, setSelectStatErrorSignal]);

    if (!roomState || !roomState.game) return null;

    const yourPokemon = roomState.game.you.pokemon;
    const opponentPokemon = roomState.game.opponent.pokemon;
    const cards = cardScaffold(yourPokemon);

    const handleCardClick = (index: number) => {
        if (!roomState || !roomState.game) return null;

        const selectedStat = DISPLAY_TO_STAT.get(cards[index].statName) as STAT_NAMES;
        if (roomState.game.lockedStats.includes(selectedStat) || lockedIn) {
            return;
        }

        playSelect();

        // Unselect Card
        if (index === selectedCardIndex) {
            setSelectedCardIndex(null);
        } else {
            setSelectedCardIndex(index);
        }
    };

    const handleButtonClick = () => {
        if (!buttonState) {
            return;
        }
        playConfirm();
        setLockedIn(true);
        setButtonState(false);
        const selectedStat: STAT_NAMES = cards[selectedCardIndex!].statName as STAT_NAMES;
        sendSelectStat(selectedStat);
    };

    const totalCards = cards.length;
    const angleIncrement = 360 / totalCards;

    const yourPokemonImgUrl = yourPokemon.sprites.officialArtwork;
    const opponentPokemonImgUrl = opponentPokemon.sprites.officialArtwork;

    return (
        <MatchLayout onNavigate={onNavigate}>
            <div className={styles.outerContainer}>
                <div className={styles.yourPokemonSection}>
                    <div className={styles.shadow}></div>
                    <span className={styles.pokemonTitle}>{yourPokemon.name.toUpperCase()}</span>
                    <div className={styles.typeList}>
                        {yourPokemon.types.map((type) => (
                            <TypeCard key={type} typeName={type} />
                        ))}
                    </div>
                    <img src={yourPokemonImgUrl} alt="Your Pokemon" />
                </div>
                <div className={styles.statSelectSection}>
                    <div className={styles.opponentPokemonWrapper}>
                        <span className={styles.vsTag}>vs</span>
                        <img
                            className={styles.opponentPokemon}
                            src={opponentPokemonImgUrl}
                            alt="Opponent's Pokémon"
                        />
                    </div>
                    <div className={styles.cardsContainer}>
                        {cards.map((card, index) => {
                            const rawStatName = DISPLAY_TO_STAT.get(card.statName);
                            const isLocked = roomState.game!.lockedStats.includes(
                                rawStatName as STAT_NAMES
                            );

                            return (
                                <CardWrapper
                                    key={index}
                                    index={index}
                                    statName={card.statName}
                                    baseStat={card.baseStat}
                                    rotation={index * angleIncrement}
                                    isSelected={index === selectedCardIndex}
                                    onCardClick={handleCardClick}
                                    isLocked={isLocked}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className={styles.lockInSection}>
                    <button
                        className={`${styles.lockInBtn} 
                        ${buttonState && !lockedIn ? styles.active : ""}
                        ${lockedIn ? styles.locked : ""}`}
                        onClick={handleButtonClick}
                    >
                        {lockedIn ? "LOCKED IN!" : "CHOOSE!"}
                    </button>
                </div>
            </div>
        </MatchLayout>
    );
}
