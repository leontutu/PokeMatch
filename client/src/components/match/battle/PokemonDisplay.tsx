import styles from "./PokemonDisplay.module.css";
import PokemonLabel from "./PokemonLabel";

type PokemonDisplayProps = {
    pokemonName: string;
    imageUrl: string;
    isOpponent?: boolean;
    attack: boolean;
    stumble: boolean;
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
 *   attack,
 *   stumble,
 * />
 */
export default function PokemonDisplay({
    pokemonName,
    imageUrl,
    attack,
    stumble,
    isOpponent = false,
}: PokemonDisplayProps) {
    const sectionStyle = `${
        isOpponent ? styles.opponentPokemonSection : styles.yourPokemonSection
    } ${attack ? styles.highZIndex : ""}`;
    const imageStyle = isOpponent ? styles.opponentPokemonImg : styles.yourPokemonImg;
    const labelStyle = isOpponent ? styles.opponentPokemonLabel : styles.yourPokemonLabel;

    return (
        <div className={sectionStyle}>
            <div className={labelStyle}>
                <PokemonLabel pokemonName={pokemonName} />
            </div>
            <img
                src={imageUrl}
                className={`
                    ${imageStyle} 
                    ${attack ? (isOpponent ? styles.opponentAttack : styles.youAttack) : ""}
                    ${stumble ? (isOpponent ? styles.oppStumble : styles.youStumble) : ""}
                `}
                alt={pokemonName}
            />
        </div>
    );
}
