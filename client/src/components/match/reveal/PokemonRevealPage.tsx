import { useEffect, useState } from "react";
import { Pokemon } from "../../../../../shared/types/types";
import { useSocket } from "../../../contexts/SocketContext";
import { NavigationHandler } from "../../../types";
import MatchLayout from "../layout/MatchLayout";
import styles from "./PokemonRevealPage.module.css";
import { useSound } from "use-sound";

type PokemonRevealPageProps = {
    onNavigate: NavigationHandler;
};

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
 * <PokemonRevealPage onNavigate={handleNavigation} />
 */

export default function PokemonRevealPage({ onNavigate }: PokemonRevealPageProps) {
    const { roomState } = useSocket();
    if (roomState === null || roomState.game === null) return null;
    let pokemon: Pokemon = roomState.game.you.pokemon;

    const [pageTransitionOver, setPageTransitionOver] = useState(false);
    const [countDownFinished, setCountDownFinished] = useState(false);
    const [flashActive, setFlashActive] = useState(false);
    const [cryReady, setCryReady] = useState(false);

    const soundUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon.id}.ogg`;
    const [playCry] = useSound(soundUrl, { volume: 1 });

    const [playWiggle, { stop: stopWiggle }] = useSound(`/pobeballWiggle.mp3`, {
        volume: 1,
        loop: true,
    });

    const [playPoof] = useSound(`/pokeballPoof.wav`, {
        volume: 1,
    });

    useEffect(() => {
        const PAGE_TRANSITION_DELAY = 1000;

        const INITIAL_DELAY = 2000;
        const REVEAL_DELAY_AFTER_FLASH = 200;
        const CRY_DELAY_AFTER_FLASH = 2000;

        const pageTransitionTimeout = setTimeout(() => {
            setPageTransitionOver(true);
            console.log("page transition over");
            setTimeout(() => setFlashActive(true), INITIAL_DELAY);
            setTimeout(() => setCountDownFinished(true), INITIAL_DELAY + REVEAL_DELAY_AFTER_FLASH);
            setTimeout(() => setCryReady(true), INITIAL_DELAY + CRY_DELAY_AFTER_FLASH);
        }, PAGE_TRANSITION_DELAY);

        return () => {
            clearTimeout(pageTransitionTimeout);
        };
    }, []);

    useEffect(() => {
        if (!countDownFinished && pageTransitionOver) {
            console.log("play wiggle");
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
    }, [countDownFinished, cryReady, pageTransitionOver, playWiggle, playCry, stopWiggle]);

    const getPokemonNameFontSize = (name: string) => {
        const length = name.length;
        if (length < 6) {
            return "6rem";
        }
        return (36 / length).toString() + "rem";
    };

    return (
        <MatchLayout onNavigate={onNavigate}>
            <div className={styles.outerContainer}>
                <div
                    className={`${styles.flashOverlay} ${flashActive ? styles.flashActive : ""}`}
                ></div>
                <img
                    className={`${styles.pokeballImage} ${countDownFinished ? styles.hidden : ""}`}
                    src={"/pokeball.png"}
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
