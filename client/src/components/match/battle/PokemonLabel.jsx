/**
 * PokemonLabel Component
 *
 * This component renders a label for a Pokémon's name. The font size of the label
 * dynamically adjusts based on the length of the Pokémon's name to ensure it fits
 * within the designated space.
 */

import styles from "./PokemonLabel.module.css";
import { useRef, useEffect } from "react";

/**
 * Renders a Pokémon name label with dynamic font size adjustment.
 * @param {Object} props - Component props.
 * @param {string} props.pokemonName - The name of the Pokémon to display.
 */
export default function PokemonLabel({ pokemonName }) {
    const pokemonLabel = useRef(null);

    useEffect(() => {
        if (pokemonLabel.current) {
            if (!pokemonName.length > 7) {
                return;
            }
            const resize = 11 / pokemonName.length;
            pokemonLabel.current.style.fontSize = resize + "rem";
        }
    }, [pokemonName]);

    return (
        <span ref={pokemonLabel} className={styles.pokemonLabel}>
            {pokemonName.toUpperCase()}
        </span>
    );
}
