import { vi, describe, test, expect } from "vitest";
import PokeApiClient from "./PokeAPIClient.js";
import NoAPIResponseError from "../errors/NoAPIResponseError.js";

const fetchSpy = vi.spyOn(global, "fetch");

describe("PokeApiClient", () => {
    describe("getRandomPokemon", () => {
        test("fetches a pokemon and return its data on success", async () => {
            const mockPokemonData = { name: "pikachu", id: 25 };
            const mockResponse = {
                ok: true,
                json: () => Promise.resolve(mockPokemonData),
            } as Response;

            fetchSpy.mockResolvedValue(mockResponse);

            const client = new PokeApiClient();
            const pokemon = await client.getRandomPokemon();

            expect(fetchSpy).toHaveBeenCalledOnce();
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.stringMatching("https://pokeapi.co/api/v2/pokemon/")
            );
            expect(pokemon).toEqual(mockPokemonData);
        });

        test("throws a NoAPIResponseError when fetch fails", async () => {
            const networkError = new Error("Network request failed");
            fetchSpy.mockRejectedValue(networkError);

            const client = new PokeApiClient();

            await expect(client.getRandomPokemon()).rejects.toThrow(NoAPIResponseError);
        });
    });
});
