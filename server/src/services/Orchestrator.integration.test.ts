import { describe, beforeEach, test, expect, vi } from "vitest";
import { GamePhases, GameCommands, StatNames } from "../../../shared/constants/constants.js";
import OrchestratorToGameCommand from "../commands/OrchestratorToGameCommand.js";
import { ROOM_SHUTDOWN_TIMEOUT_MS } from "../constants/constants.js";
import ClientManager from "../managers/ClientManager.js";
import RoomManager from "../managers/RoomManager.js";
import { delay } from "../utils/utils.js";
import Orchestrator from "./Orchestrator.js";
import PokeApiClient from "../clients/PokeAPIClient.js";
import SocketService from "./SocketService.js";

vi.mock("./SocketService.js");

describe("Orchestrator", () => {
    describe("Integration tests", () => {
        let orchestrator: Orchestrator;
        let roomManager: RoomManager;
        let clientManager: ClientManager;
        let pokeApiClient: PokeApiClient;
        let socketService: SocketService;
        let mockSocket1: any;
        let mockSocket2: any;

        beforeEach(() => {
            roomManager = new RoomManager();
            clientManager = new ClientManager();
            // real pokeAPIClient for integration test
            pokeApiClient = new PokeApiClient();
            orchestrator = new Orchestrator(roomManager, clientManager, pokeApiClient);
            socketService = new SocketService({} as any, orchestrator);
            orchestrator.setSocketService(socketService);

            mockSocket1 = { handshake: { auth: { uuid: "uuid1" } } };
            mockSocket2 = { handshake: { auth: { uuid: "uuid2" } } };
        });

        test("creates room, adds players, reacts to ready toggle, and starts game", async () => {
            // player 1 connects and creates room
            orchestrator.onConnection(mockSocket1);
            orchestrator.onNameEnter(mockSocket1, "Alice");
            orchestrator.onCreateRoom(mockSocket1);

            const client1 = clientManager.getClient(mockSocket1);
            const roomId = client1!.roomId!;

            // player 2 connects and joins
            orchestrator.onConnection(mockSocket2);
            orchestrator.onNameEnter(mockSocket2, "Bob");
            orchestrator.onJoinRoom(mockSocket2, roomId.toString());

            const room = roomManager.getRoom(roomId);
            expect(room.clientRecords).toHaveLength(2);

            // both ready up
            orchestrator.onToggleReady(mockSocket1);
            orchestrator.onToggleReady(mockSocket2);

            // game starts
            await delay(200); // wait for async pokemon fetch

            expect(room.game).toBeDefined();
            expect(room.game!.players[0].pokemon).toBeDefined();
            expect(room.game!.players[1].pokemon).toBeDefined();
            expect(room.game!.phase).toBe(GamePhases.POKEMON_REVEAL);
        });

        test("triggers room shutdown timer on player disconnect", () => {
            vi.useFakeTimers();

            orchestrator.onConnection(mockSocket1);
            orchestrator.onNameEnter(mockSocket1, "Alice");
            orchestrator.onCreateRoom(mockSocket1);

            const roomId = clientManager.getClient(mockSocket1)!.roomId!;

            // player disconnects
            orchestrator.onDisconnect(mockSocket1);

            // room has timeout scheduled
            expect(roomManager.roomTimeouts.has(roomId)).toBe(true);

            vi.advanceTimersByTime(ROOM_SHUTDOWN_TIMEOUT_MS);

            // room is deleted
            expect(roomManager.hasRoom(roomId)).toBe(false);

            vi.useRealTimers();
        });

        test("completes a full battle round", async () => {
            // setup: two players in game with pokemon assigned
            orchestrator.onConnection(mockSocket1);
            orchestrator.onNameEnter(mockSocket1, "Alice");
            orchestrator.onCreateRoom(mockSocket1);

            const roomId = clientManager.getClient(mockSocket1)!.roomId!;

            orchestrator.onConnection(mockSocket2);
            orchestrator.onNameEnter(mockSocket2, "Bob");
            orchestrator.onJoinRoom(mockSocket2, roomId.toString());

            orchestrator.onToggleReady(mockSocket1);
            orchestrator.onToggleReady(mockSocket2);

            await delay(200); // wait for async pokemon fetch

            const room = roomManager.getRoom(roomId);
            const game = room.game!;

            // both players select stats
            const command1 = OrchestratorToGameCommand.fromClient(
                GameCommands.SELECT_STAT,
                StatNames.ATTACK as any,
                "uuid1"
            );
            orchestrator.onGameCommand(mockSocket1, command1);

            const command2 = OrchestratorToGameCommand.fromClient(
                GameCommands.SELECT_STAT,
                StatNames.DEFENSE as any,
                "uuid2"
            );
            orchestrator.onGameCommand(mockSocket2, command2);

            // game transitions to BATTLE phase
            expect(game.phase).toBe(GamePhases.BATTLE);

            // both players finished watching the battle sequence
            orchestrator.onBattleEnd(mockSocket1);
            orchestrator.onBattleEnd(mockSocket2);

            // two points have been awarded
            const totalPoints = game.players[0].points + game.players[1].points;
            expect(totalPoints).toBe(2);

            // game transitions back to SELECT_STAT phase
            expect(game.phase).toBe(GamePhases.SELECT_STAT);
        });
    });
});
