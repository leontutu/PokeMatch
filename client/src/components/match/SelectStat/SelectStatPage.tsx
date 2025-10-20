import { useState, useEffect } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import styles from "./SelectStatPage.module.scss";
import MatchLayout from "../layout/MatchLayout";
import TypeCard from "./TypeCard";
import cardScaffold from "../../../scaffolds/cardScaffold";
import CardWrapper from "./CardWrapper";
import { DisplayToStat } from "../../../constants/constants";
import { StatNames } from "../../../../../shared/constants/constants";
import { useSound } from "use-sound";
import selectSound from "../../../assets/audio/sounds/select.mp3";
import confirmSound from "../../../assets/audio/sounds/confirm.mp3";
import { UI_TEXT } from "../../../constants/uiText";

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
export default function SelectStatPage() {
    const { viewRoom, sendSelectStat, selectStatErrorSignal, setSelectStatErrorSignal } = useSocket();

    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [buttonState, setButtonState] = useState(false);
    const [lockedIn, setLockedIn] = useState(false);

    const [playSelect] = useSound(selectSound, {
        volume: 1,
    });

    const [playConfirm] = useSound(confirmSound, {
        volume: 1,
    });

    useEffect(() => {
        setButtonState(!lockedIn && selectedCardIndex !== null);
    }, [selectedCardIndex, lockedIn]);

    useEffect(() => {
        if (selectStatErrorSignal) {
            alert(UI_TEXT.ALERTS.STAT_ALREADY_LOCKED);
            setButtonState(false);
            setLockedIn(false);
            setSelectedCardIndex(null);
            setSelectStatErrorSignal(false);
        }
    }, [selectStatErrorSignal, setSelectStatErrorSignal]);

    if (!viewRoom || !viewRoom.viewGame) return null;

    const yourPokemon = viewRoom.viewGame.you.pokemon;
    const opponentPokemon = viewRoom.viewGame.opponent.pokemon;
    const cards = cardScaffold(yourPokemon);

    const handleCardClick = (index: number) => {
        if (!viewRoom || !viewRoom.viewGame) return null;

        const selectedStat = DisplayToStat.get(cards[index].statName) as StatNames;
        if (viewRoom.viewGame.lockedStats.includes(selectedStat) || lockedIn) {
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
        const selectedStat: StatNames = cards[selectedCardIndex!].statName as StatNames;
        sendSelectStat(selectedStat);
    };

    const totalCards = cards.length;
    const angleIncrement = 360 / totalCards;

    const yourPokemonImgUrl = yourPokemon.sprites.officialArtwork;
    const opponentPokemonImgUrl = opponentPokemon.sprites.officialArtwork;

    return (
        <MatchLayout>
            <div className={styles.outerContainer}>
                <div className={styles.yourPokemonSection}>
                    <div className={styles.shadow}></div>
                    <span className={styles.pokemonTitle}>{yourPokemon.name.toUpperCase()}</span>
                    <div className={styles.typeList}>
                        {yourPokemon.types.map((type) => (
                            <TypeCard key={type} typeName={type} />
                        ))}
                    </div>
                    <img src={yourPokemonImgUrl} alt={UI_TEXT.ALT_TEXT.YOUR_POKEMON} />
                </div>
                <div className={styles.statSelectSection}>
                    <div className={styles.opponentPokemonWrapper}>
                        <span className={styles.vsTag}>{UI_TEXT.LABELS.VS}</span>
                        <img
                            className={styles.opponentPokemon}
                            src={opponentPokemonImgUrl}
                            alt={UI_TEXT.ALT_TEXT.OPPONENT_POKEMON}
                        />
                    </div>
                    <div className={styles.cardsContainer}>
                        {cards.map((card, index) => {
                            const rawStatName = DisplayToStat.get(card.statName);
                            const isLocked = viewRoom.viewGame!.lockedStats.includes(
                                rawStatName as StatNames
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
                    <span className={styles.roundLabel}>
                        {UI_TEXT.LABELS.ROUND(viewRoom.viewGame.currentRound)}
                    </span>
                </div>
                <div className={styles.lockInSection}>
                    <button
                        className={`${styles.lockInBtn} 
                        ${buttonState && !lockedIn ? styles.active : ""}
                        ${lockedIn ? styles.locked : ""}`}
                        onClick={handleButtonClick}
                    >
                        {lockedIn ? UI_TEXT.BUTTONS.LOCKED_IN : UI_TEXT.BUTTONS.CHOOSE}
                    </button>
                </div>
            </div>
        </MatchLayout>
    );
}
