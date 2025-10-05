import { useEffect, useState } from "react";
import { Pokemon } from "../../../../../shared/types/types";
import { useSocket } from "../../../contexts/SocketContext";
import { useUIInfoContext } from "../../../contexts/UIInfoContext";
import MatchLayout from "../layout/MatchLayout";
import styles from "./PokemonRevealPage.module.css";
import { useSound } from "use-sound";

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
    const { viewRoom } = useSocket();
    const { isWipingIn } = useUIInfoContext();

    if (viewRoom === null || viewRoom.viewGame === null) return null;
    let pokemon: Pokemon = viewRoom.viewGame.you.pokemon;

    const [countDownFinished, setCountDownFinished] = useState(false);
    const [flashActive, setFlashActive] = useState(false);
    const [cryReady, setCryReady] = useState(false);

    const soundUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon.id}.ogg`;
    const [playCry] = useSound(soundUrl, { volume: 1 });

    const [playWiggle, { stop: stopWiggle }] = useSound(`/audio/sounds/pokeballWiggle.mp3`, {
        volume: 0.5,
        loop: true,
    });

    const [playPoof] = useSound(`/audio/sounds/pokeballPoof.wav`, {
        volume: 1,
    });

    useEffect(() => {
        if (isWipingIn) return;
        const WIGGLE_DURATION = 2000;
        const FLASH_DURATION = 200;
        const CRY_DELAY_AFTER_WIGGLE = 2000;

        setTimeout(() => setFlashActive(true), WIGGLE_DURATION);
        setTimeout(() => setCountDownFinished(true), WIGGLE_DURATION + FLASH_DURATION);
        setTimeout(() => setCryReady(true), WIGGLE_DURATION + CRY_DELAY_AFTER_WIGGLE);
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

    return (
        <MatchLayout>
            <div className={styles.outerContainer}>
                <div className={`${styles.flashOverlay} ${flashActive ? styles.flashActive : ""}`}></div>
                <img
                    className={`${styles.pokeballImage} 
                    ${countDownFinished ? styles.hidden : ""}
                    ${!isWipingIn && !countDownFinished ? styles.wiggle : ""}
                    `}
                    src={"/graphics/game/pokeball.png"}
                    alt={"pokeball"}
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
                        ...is ready to battle!
                    </span>
                </div>
            </div>
        </MatchLayout>
    );
}
