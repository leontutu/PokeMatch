import styles from "./PokemonDisplay.module.css";
import PokemonLabel from "./PokemonLabel";


type PokemonDisplayProps = {
    pokemonName: string ;
    imageUrl: string;
    isOpponent?: boolean;
};
/**
 * Renders a display section for a single Pokémon in the battle.
 *
 * This component shows the Pokémon's image and name. It can be styled
 * differently for the player's Pokémon versus the opponent's based on the
 * `isOpponent` prop.
 *
 * @example
 * <PokemonDisplay
 *   pokemonName="Pikachu"
 *   imageUrl="https://example.com/pikachu.png"
 *   isOpponent={true}
 * />
 */
export default function PokemonDisplay({ pokemonName, imageUrl, isOpponent = false }: PokemonDisplayProps) {
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
                <PokemonLabel pokemonName={pokemonName} />
            </div>
            <img src={imageUrl} className={imageStyle} alt={pokemonName} />
        </div>
    );
}