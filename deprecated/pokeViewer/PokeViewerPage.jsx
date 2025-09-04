import { useState, useEffect } from "react";
import StatCard from "../../client/src/components/atoms/StatCard";
import TypeCard from "../../client/src/components/atoms/TypeCard";

export default function PokeViewerPage({ onNavigate }) {
    const [activeStat, setActiveStat] = useState(null);
    const [pokemon, setPokemon] = useState(null);

    useEffect(() => {
        getNewPokemon();
    }, []);

    async function getNewPokemon() {
        const response = await fetch("/api/randomPokemon");
        const data = await response.json();

        const imageUrl = data.sprites.other["official-artwork"].front_default;
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => {
            setPokemon(data);
        };
    }

    function onActionButtonClick() {
        getNewPokemon();
    }

    function handleStatCardClick(statName) {
        setActiveStat(statName);
    }

    return (
        <div className={styles.outerContainer}>
            <button
                className={styles.backButton}
                onClick={() => onNavigate("homePage")}
            >
                ←
            </button>
            <h1 className={styles.pokemonName}>
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </h1>

            <img
                className={styles.pokemonImage}
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt={pokemon.name}
            />
            <div className={styles.typeList}>
                {pokemon.types.map((typeInfo) => (
                    <TypeCard
                        key={typeInfo.type.name}
                        typeName={typeInfo.type.name}
                        className={styles.typeCard}
                    />
                ))}
            </div>
            <div className={styles.statsTable}>
                <StatCard
                    statName="💖 HP"
                    statValue={pokemon.stats[0].base_stat}
                    onStatCardClick={handleStatCardClick}
                />
                <StatCard
                    statName="💨 Speed"
                    statValue={pokemon.stats[5].base_stat}
                    onStatCardClick={handleStatCardClick}
                />
                <StatCard
                    statName="⚔️ Attack"
                    statValue={pokemon.stats[1].base_stat}
                    onStatCardClick={handleStatCardClick}
                />
                <StatCard
                    statName="🛡️ Defense"
                    statValue={pokemon.stats[2].base_stat}
                    onStatCardClick={handleStatCardClick}
                />
                <StatCard
                    statName="✨ Sp. Attack"
                    statValue={pokemon.stats[3].base_stat}
                    onStatCardClick={handleStatCardClick}
                />
                <StatCard
                    statName="🔷 Sp. Defense"
                    statValue={pokemon.stats[4].base_stat}
                    onStatCardClick={handleStatCardClick}
                />
                <StatCard
                    statName="⚖️ Weight"
                    statValue={pokemon.weight / 10 + " kg"}
                    onStatCardClick={handleStatCardClick}
                />
                <StatCard
                    statName="📏 Height"
                    statValue={pokemon.height + " m"}
                    onStatCardClick={handleStatCardClick}
                />
            </div>
            <button
                type="button"
                className={styles.actionButton}
                onClick={onActionButtonClick}
            >
                Next Pokemon!
            </button>
        </div>
    );
}
