/**
 * SelectStatPage Component
 *
 * Displays the stat selection screen during a match, allowing the player to choose a stat to challenge.
 * Handles stat selection, locking, error feedback, and UI rendering for both player's Pokémon.
 * Uses styling from SelectStatPage.module.css for layout and appearance.
 * NOTE: This component's implementation is very hacky and will be rewritten from scratch soon™
 */

import { useState, useEffect } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import styles from "./SelectStatPage.module.css";
import MatchLayout from "../layout/MatchLayout";
import TypeCard from "./TypeCard";
import cardScaffold from "../../../scaffolds/cardScaffold";
import CardWrapper from "./CardWrapper";
import { DISPLAY_TO_STAT } from "../../../constants/constants";

/**
 * SelectStatPage functional component.
 * Renders the stat selection interface for the match phase.
 * @returns {JSX.Element} The SelectStatPage component.
 */
export default function SelectStatPage({ onNavigate }) {
    const { roomState, sendSelectStat } = useSocket();
    const { selectStatError, setSelectStatError } = useSocket();
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [buttonState, setButtonState] = useState(false);
    const [lockedIn, setLockedIn] = useState(false);

    useEffect(() => {
        setButtonState(!lockedIn && selectedCardIndex !== null);
    }, [selectedCardIndex, lockedIn]);

    useEffect(() => {
        if (selectStatError) {
            alert("[Server]: You selected an already locked stat.");
            setButtonState(false);
            setLockedIn(false);
            setSelectedCardIndex(null);
            setSelectStatError(false);
        }
    }, [selectStatError, setSelectStatError]);

    if (!roomState) return null;

    const yourPokemon = roomState.game.you.pokemon;
    const opponentPokemon = roomState.game.opponent.pokemon;
    const cards = cardScaffold(yourPokemon);

    const handleCardClick = (index) => {
        const selectedStat = DISPLAY_TO_STAT.get(cards[index].statName);
        if (roomState.game.lockedStats.includes(selectedStat) || lockedIn) {
            return;
        }

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
        setLockedIn(true);
        setButtonState(false);
        const selectedStat = cards[selectedCardIndex].statName;
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
                    <span className={styles.pokemonTitle}>
                        {yourPokemon.name.toUpperCase()}
                    </span>
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
                            const rawStatName = DISPLAY_TO_STAT.get(
                                card.statName
                            );
                            const isLocked =
                                roomState.game.lockedStats.includes(
                                    rawStatName
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
