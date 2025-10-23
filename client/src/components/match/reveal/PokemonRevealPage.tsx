import { useEffect, useState } from "react";
import { Pokemon } from "../../../../../shared/types/types";
import { useSocketContext } from "../../../contexts/SocketContext";
import { useUIInfoContext } from "../../../contexts/UIInfoContext";
import MatchLayout from "../layout/MatchLayout";
import styles from "./PokemonRevealPage.module.scss";
import { useSound } from "use-sound";
import pokeballWiggle from "../../../assets/audio/sounds/pokeball-wiggle.mp3";
import pokeballPoof from "../../../assets/audio/sounds/pokeball-poof.mp3";
import pokeballImage from "../../../assets/graphics/game/pokeball.png";
import { UI_TEXT } from "../../../constants/uiText";

/**
 * Renders the Pokémon reveal animation sequence.
 *
 * This component orchestrates a sequence of animations to reveal the player's Pokémon.
 * It begins with a wiggling pokeball, triggers a flash effect, and then transitions
 * to show the Pokémon's image and name. The timing of these animations is controlled
 * internally using useEffect and timeouts.
 * This page is shown at the start of a match, before transitioning to the stat selection phase.
 *
 * @example
 * <PokemonRevealPage />
 */

export default function PokemonRevealPage() {
    const { viewRoom } = useSocketContext();
    const { isWipingIn } = useUIInfoContext();

    const pokemon: Pokemon | undefined = viewRoom?.viewGame?.you.pokemon;

    const [countDownFinished, setCountDownFinished] = useState(false);
    const [flashActive, setFlashActive] = useState(false);
    const [cryReady, setCryReady] = useState(false);

    const soundUrl = pokemon
        ? `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon.id}.ogg`
        : "silence.ogg";
    const [playCry] = useSound(soundUrl || "", { volume: 1 });

    const [playWiggle, { stop: stopWiggle }] = useSound(pokeballWiggle, {
        volume: 0.5,
        loop: true,
    });

    const [playPoof] = useSound(pokeballPoof, {
        volume: 1,
    });

    useEffect(() => {
        if (isWipingIn) return;
        const WIGGLE_DURATION = 2000;
        const FLASH_DURATION = 200;
        const CRY_DELAY_AFTER_WIGGLE = 2000;

        const flashTimer = setTimeout(() => setFlashActive(true), WIGGLE_DURATION);
        const countdownTimer = setTimeout(
            () => setCountDownFinished(true),
            WIGGLE_DURATION + FLASH_DURATION
        );
        const cryTimer = setTimeout(() => setCryReady(true), WIGGLE_DURATION + CRY_DELAY_AFTER_WIGGLE);

        return () => {
            clearTimeout(flashTimer);
            clearTimeout(countdownTimer);
            clearTimeout(cryTimer);
        };
    }, [isWipingIn]);

    useEffect(() => {
        if (!countDownFinished && !isWipingIn) {
            playWiggle();
        }

        if (countDownFinished && !cryReady) {
            stopWiggle();
            playPoof();
        }

        if (cryReady) {
            playCry();
        }

        return () => {
            stopWiggle();
        };
    }, [isWipingIn, countDownFinished, cryReady, playWiggle, playCry, stopWiggle]);

    const getPokemonNameFontSize = (name: string) => {
        const length = name.length;
        if (length < 6) {
            return "6rem";
        }
        return (36 / length).toString() + "rem";
    };

    // Refer to #35 on why this is here
    if (pokemon === undefined || viewRoom === null || viewRoom.viewGame === null) return null;

    return (
        <MatchLayout>
            <div className={styles.outerContainer}>
                <div className={`${styles.flashOverlay} ${flashActive ? styles.flashActive : ""}`}></div>
                <img
                    className={`${styles.pokeballImage} 
                    ${countDownFinished ? styles.hidden : ""}
                    ${!isWipingIn && !countDownFinished ? styles.wiggle : ""}
                    `}
                    src={pokeballImage}
                    alt={UI_TEXT.ALT_TEXT.POKEBALL}
                />
                <img
                    className={`${styles.pokemonImage} 
                    ${countDownFinished ? "" : styles.hidden}
                    ${cryReady ? styles.excite : ""}
                    `}
                    src={pokemon.sprites.officialArtwork}
                    alt={pokemon.name}
                />
                <div
                    className={`${styles.revealTextContainer} 

                    ${countDownFinished ? styles.revealFromLeft : ""}`}
                >
                    <span
                        className={styles.pokemonName}
                        style={{
                            fontSize: getPokemonNameFontSize(pokemon.name),
                        }}
                    >
                        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                    </span>
                    <span className={`${styles.subText} ${countDownFinished ? styles.fadeIn : ""}`}>
                        {UI_TEXT.MESSAGES.READY_TO_BATTLE}
                    </span>
                </div>
            </div>
        </MatchLayout>
    );
}
