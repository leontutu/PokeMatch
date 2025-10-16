import styles from "./PokemonLabel.module.scss";
import { useRef, useEffect } from "react";

type PokemonLabelProps = {
    pokemonName: string;
};

/**
 * Renders a Pokémon name label with dynamic font size adjustment.
 *
 * The font size of the label dynamically adjusts based on the length of the
 * Pokémon's name to ensure it fits within the designated space.
 *
 * @example
 * <PokemonLabel pokemonName="Pikachu" />
 */
export default function PokemonLabel({ pokemonName }: PokemonLabelProps) {
    const pokemonLabel = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (pokemonLabel.current) {
            if (!(pokemonName.length > 7)) {
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
