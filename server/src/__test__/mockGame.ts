import Game from "../models/Game.js";
import { createMockPlayer } from "./mockPlayer.js";

export function createMockGame(): Game {
    const participants = [
        { name: "Alice", uuid: "uuid1" },
        { name: "Bob", uuid: "uuid2" },
    ];
    const game = new Game(participants);
    game.players[0] = createMockPlayer("Alice", "uuid1");
    game.players[1] = createMockPlayer("Bob", "uuid2");
    return game;
}
