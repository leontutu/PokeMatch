import Player from "../models/Player.js";
import { createMockPokemon } from "./mockPokemon.js";

export function createMockPlayer(name: string = "Alice", uuid: string = "uuid1"): Player {
    return {
        name,
        uuid,
        inGameId: 1,
        points: 10,
        selectedStat: null,
        pokemon: createMockPokemon(),
    } as Player;
}
