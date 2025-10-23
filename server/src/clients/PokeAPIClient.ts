import NoAPIResponseError from "../errors/NoAPIResponseError.js";

/**
 * A client for interacting with the public PokeAPI (pokeapi.co).
 * This module abstracts the logic for fetching Pokémon data.
 */

/**
 * Fetches data for a single random Pokémon.
 * @returns A promise that resolves to the Pokémon's JSON data.
 * @throws If the API request fails.
 */
export async function getRandomPokemon(): Promise<object> {
    const randomPokeId: number = Math.floor(Math.random() * 151) + 1;
    const url: string = `https://pokeapi.co/api/v2/pokemon/${randomPokeId}`;
    try {
        const response: Response = await fetch(url);
        return await response.json();
    } catch (e: unknown) {
        throw new NoAPIResponseError(url);
    }
}
