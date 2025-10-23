import Game from "../models/Game.js";
import { createMockPlayer } from "./mockPlayer.js";

export function createMockGame(): Game {
    const participants = [
        { name: "Jessie", uuid: "uuid1" },
        { name: "James", uuid: "uuid2" },
    ];
    const game = new Game(participants);
    game.players[0] = createMockPlayer("Jessie", "uuid1");
    game.players[1] = createMockPlayer("James", "uuid2");
    return game;
}
