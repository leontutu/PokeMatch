import { test, expect, describe, beforeEach } from "vitest";
import { mapRoomToViewRoom } from "./mappers.js";
import Room from "../models/Room.js";
import Game from "../models/Game.js";
import Player from "../models/Player.js";
import MappingError from "../errors/MappingError.js";
import { StatNames } from "../../../shared/constants/constants.js";
import { createMockGame, createMockPlayer } from "../__test__/index.js";

describe("mappers", () => {
    let room: Room;
    beforeEach(() => {
        room = new Room(1);
        room.clientRecords = [
            { client: { uuid: "uuid1", name: "Alice" }, isReady: false },
            { client: { uuid: "uuid2", name: "Bob" }, isReady: true },
        ];
    });

    describe("mapRoomToViewRoom", () => {
        test("maps Room to ViewRoom correctly", () => {
            const viewRoom = mapRoomToViewRoom(room, "uuid1");
            expect(viewRoom.id).toBe(1);
            expect(viewRoom.viewClientRecords.length).toBe(2);
            expect(viewRoom.viewClientRecords[0].clientName).toBe("Alice");
            expect(viewRoom.viewClientRecords[1].isReady).toBe(true);
            expect(viewRoom.viewGame).toBeNull();
        });

        test("includes ViewGame when Room has a Game", () => {
            room.game = createMockGame();

            const viewRoom = mapRoomToViewRoom(room, "uuid1");

            expect(viewRoom.viewGame).not.toBeNull();
            expect(viewRoom.viewGame!.phase).toBe(room.game.phase);
            expect(viewRoom.viewGame!.you.name).toBe("Alice");
            expect(viewRoom.viewGame!.opponent.name).toBe("Bob");
        });

        test("throws MappingError on invalid game", () => {
            // game with no pokemon assigned to players
            room.game = new Game([new Player("uuid1", "Alice", 1), new Player("uuid2", "Bob", 2)]);
            expect(() => mapRoomToViewRoom(room, "uuid1")).toThrow(MappingError);
        });
    });

    describe("mapPlayerToViewPlayer", () => {
        beforeEach(() => {
            room.game = createMockGame();
        });

        test("maps Player to ViewPlayer correctly", () => {
            const secondPlayer = createMockPlayer("Bob", "uuid2");
            secondPlayer.inGameId = 2;
            room.game!.players[1] = secondPlayer;
            const viewRoom = mapRoomToViewRoom(room, "uuid1");
            const viewPlayerYou = viewRoom.viewGame!.you;
            const viewPlayerOpponent = viewRoom.viewGame!.opponent;

            expect(viewPlayerYou.name).toBe("Alice");
            expect(viewPlayerYou.inGameId).toBe(1);
            expect(viewPlayerYou.points).toBe(10);
            expect(viewPlayerYou.pokemon.id).toBe(1);
            expect(viewPlayerYou.challengeStat).toBeNull();

            expect(viewPlayerOpponent.name).toBe("Bob");
            expect(viewPlayerOpponent.inGameId).toBe(2);
            expect(viewPlayerOpponent.points).toBe(10);
            expect(viewPlayerOpponent.pokemon.id).toBe(1);
        });

        test("includes challengedStat when applicable", () => {
            const player2 = room.game!.players[1];
            player2.selectedStat = { name: StatNames.DEFENSE, value: 49 };
            const viewRoom = mapRoomToViewRoom(room, "uuid1");
            const viewPlayer1 = viewRoom.viewGame!.you;

            expect(viewPlayer1.challengedStat).toEqual({
                name: StatNames.DEFENSE,
                value: 49,
            });
        });

        test("throws MappingError if Player has no Pokemon", () => {
            room.game!.players[0].pokemon = null;
            expect(() => mapRoomToViewRoom(room, "uuid1")).toThrow(MappingError);
        });
    });

    describe("mapGameToViewGame", () => {
        test("maps Game to ViewGame correctly", () => {
            room.game = createMockGame();
            const viewRoom = mapRoomToViewRoom(room, "uuid2");
            const viewGame = viewRoom.viewGame!;
            expect(viewGame.phase).toBe(room.game.phase);
            expect(viewGame.lockedStats).toBe(room.game.lockedStats);
            expect(viewGame.winner).toBe(room.game.winner);
            expect(viewGame.firstMove).toBe(room.game.firstMove);
            expect(viewGame.currentRound).toBe(room.game.currentRound);
            expect(viewGame.you.name).toBe("Bob");
            expect(viewGame.opponent.name).toBe("Alice");
        });
    });
});
