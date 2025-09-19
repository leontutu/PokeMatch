import { useEffect, useState } from "react";
import { Pokemon } from "../../../../../shared/types/types";
import { useSocket } from "../../../contexts/SocketContext";
import { NavigationHandler } from "../../../types";
import MatchLayout from "../layout/MatchLayout";
import styles from "./PokemonRevealPage.module.css";

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

export default function PokemonRevealPage({
    onNavigate,
}: PokemonRevealPageProps) {
    const { roomState } = useSocket();
    if (roomState === null || roomState.game === null) return null;
    let pokemon: Pokemon = roomState.game.you.pokemon;

    const [countDownFinished, setCountDownFinished] = useState(false);
    const [flashActive, setFlashActive] = useState(false);

    const flashCountdownTime = 3000;

    useEffect(() => {
        setTimeout(() => {
            setFlashActive(true);
            setTimeout(() => {
                setCountDownFinished(true);
            }, 300);
        }, flashCountdownTime);
    }, []);

    const getPokemonNameFontSize = (name: string) => {
        const length = name.length;
        if (length > 9) {
            return "4rem";
        }
        if (length > 7) {
            return "4.5rem";
        }
        return "6rem";
    };

    return (
        <MatchLayout onNavigate={onNavigate}>
            <div className={styles.outerContainer}>
                <div
                    className={`${styles.flashOverlay} ${
                        flashActive ? styles.flashActive : ""
                    }`}
                ></div>
                <img
                    className={`${styles.pokeballImage} ${
                        countDownFinished ? styles.hidden : ""
                    }`}
                    src={"/pokeball.png"}
                    alt={"pokeball"}
                />
                <img
                    className={`${styles.pokemonImage} ${
                        countDownFinished ? "" : styles.hidden
                    }`}
                    src={pokemon.sprites.officialArtwork}
                    alt={pokemon.name}
                />
                <div
                    className={`${styles.revealTextContainer} 

                    ${countDownFinished ? styles.slideIn : ""}`}
                >
                    <span
                        className={styles.pokemonName}
                        style={{
                            fontSize: getPokemonNameFontSize(pokemon.name),
                        }}
                    >
                        {pokemon.name.charAt(0).toUpperCase() +
                            pokemon.name.slice(1)}
                    </span>
                    <span
                        className={`${styles.subText} ${
                            countDownFinished ? styles.fadeIn : ""
                        }`}
                    >
                        ...is ready to battle!
                    </span>
                </div>
            </div>
        </MatchLayout>
    );
}
