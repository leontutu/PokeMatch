import { vi, describe, test, expect } from "vitest";
import { getRandomPokemon } from "./pokeAPIClient.js";
import NoAPIResponseError from "../errors/NoAPIResponseError.js";

const fetchSpy = vi.spyOn(global, "fetch");

describe("pokeApiClient", () => {
    describe("getRandomPokemon", () => {
        test("fetches a pokemon and return its data on success", async () => {
            const mockPokemonData = { name: "pikachu", id: 25 };
            const mockResponse = {
                ok: true,
                json: () => Promise.resolve(mockPokemonData),
            } as Response;

            fetchSpy.mockResolvedValue(mockResponse);

            const pokemon = await getRandomPokemon();

            expect(fetchSpy).toHaveBeenCalledOnce();
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.stringMatching("https://pokeapi.co/api/v2/pokemon/")
            );
            expect(pokemon).toEqual(mockPokemonData);
        });

        test("throws a NoAPIResponseError when fetch fails", async () => {
            const networkError = new Error("Network request failed");
            fetchSpy.mockRejectedValue(networkError);

            await expect(getRandomPokemon()).rejects.toThrow(NoAPIResponseError);
        });
    });
});
