import styles from "./PokemonDisplay.module.css";
import PokemonLabel from "./PokemonLabel";

/**
 * PokemonDisplay Component
 *
 * Renders a section for a single Pokémon in the battle, including its image and name label.
 * It is styled differently for the player's Pokémon versus the opponent's.
 *
 * @param {object} props - The component props.
 * @param {object} props.pokemon - The Pokémon data object.
 * @param {string} props.imageUrl - The URL for the Pokémon's sprite.
 * @param {boolean} [props.isOpponent=false] - If true, applies opponent-specific styling.
 * @returns {JSX.Element} The PokemonDisplay component.
 */
export default function PokemonDisplay({ pokemon, imageUrl, isOpponent = false }) {
    const sectionStyle = isOpponent
        ? styles.opponentPokemonSection
        : styles.yourPokemonSection;
    const imageStyle = isOpponent
        ? styles.opponentPokemonImg
        : styles.yourPokemonImg;
    const labelStyle = isOpponent
        ? styles.opponentPokemonLabel
        : styles.yourPokemonLabel;

    return (
        <div className={sectionStyle}>
            <div className={labelStyle}>
                <PokemonLabel pokemonName={pokemon.name} />
            </div>
            <img src={imageUrl} className={imageStyle} alt={pokemon.name} />
        </div>
    );
}