import { describe, beforeEach, test, expect, vi } from "vitest";
import { GamePhases, GameCommands, StatNames } from "../../../shared/constants/constants.js";
import OrchestratorToGameCommand from "../commands/OrchestratorToGameCommand.js";
import { ROOM_SHUTDOWN_TIMEOUT_MS } from "../constants/constants.js";
import ClientManager from "../managers/ClientManager.js";
import RoomManager from "../managers/RoomManager.js";
import Orchestrator from "./Orchestrator.js";
import SocketService from "./SocketService.js";

vi.mock("./SocketService.js");

describe("Orchestrator", () => {
    /**
     * Integration tests for the server.
     * Reach into all layers of the backend app, simulating from client connects
     * to full game rounds.
     * NOTE: Does NOT mock the external PokeAPI client. Tests
     * MUST fail if the PokeAPI is unreachable or has changed.
     */
    describe("integration tests", () => {
        let orchestrator: Orchestrator;
        let roomManager: RoomManager;
        let clientManager: ClientManager;
        let socketService: SocketService;
        let mockSocket1: any;
        let mockSocket2: any;

        beforeEach(() => {
            roomManager = new RoomManager();
            clientManager = new ClientManager();
            orchestrator = new Orchestrator(roomManager, clientManager);
            socketService = new SocketService({} as any, orchestrator);
            orchestrator.setSocketService(socketService);

            mockSocket1 = { handshake: { auth: { uuid: "uuid1" } } };
            mockSocket2 = { handshake: { auth: { uuid: "uuid2" } } };
        });

        test("creates room, adds players, reacts to ready toggle, and starts game", async () => {
            // player 1 connects and creates room
            orchestrator.onConnection(mockSocket1);
            orchestrator.onNameEnter(mockSocket1, "Jessie");
            orchestrator.onCreateRoom(mockSocket1);

            const client1 = clientManager.getClient(mockSocket1);
            const roomId = client1!.roomId!;

            // player 2 connects and joins
            orchestrator.onConnection(mockSocket2);
            orchestrator.onNameEnter(mockSocket2, "James");
            orchestrator.onJoinRoom(mockSocket2, roomId.toString());

            const room = roomManager.getRoom(roomId);
            expect(room.clientRecords).toHaveLength(2);

            // both ready up
            orchestrator.onToggleReady(mockSocket1);
            orchestrator.onToggleReady(mockSocket2);

            await vi.waitFor(
                () => {
                    expect(room.game).toBeDefined();
                },
                {
                    timeout: 5000,
                    interval: 50,
                }
            );

            expect(room.game).toBeDefined();
            expect(room.game!.players[0].pokemon).toBeDefined();
            expect(room.game!.players[1].pokemon).toBeDefined();
            expect(room.game!.phase).toBe(GamePhases.SELECT_STAT);
        });

        test("triggers room shutdown timer on player disconnect", () => {
            vi.useFakeTimers();

            orchestrator.onConnection(mockSocket1);
            orchestrator.onNameEnter(mockSocket1, "Jessie");
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
            orchestrator.onNameEnter(mockSocket1, "Jessie");
            orchestrator.onCreateRoom(mockSocket1);

            const roomId = clientManager.getClient(mockSocket1)!.roomId!;
            const room = roomManager.getRoom(roomId);

            orchestrator.onConnection(mockSocket2);
            orchestrator.onNameEnter(mockSocket2, "James");
            orchestrator.onJoinRoom(mockSocket2, roomId.toString());

            orchestrator.onToggleReady(mockSocket1);
            orchestrator.onToggleReady(mockSocket2);

            // wait for async pokeAPI fetch
            await vi.waitFor(
                () => {
                    expect(room.game?.players[0].pokemon?.stats.attack).toBeDefined();
                },
                {
                    timeout: 5000,
                    interval: 50,
                }
            );

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
            expect(room.game!.phase).toBe(GamePhases.BATTLE);

            // both players finished watching the battle sequence
            orchestrator.onBattleEnd(mockSocket1);
            orchestrator.onBattleEnd(mockSocket2);

            // two points have been awarded
            const totalPoints = room.game!.players[0].points + room.game!.players[1].points;
            expect(totalPoints).toBe(2);

            // game transitions back to SELECT_STAT phase
            expect(room.game!.phase).toBe(GamePhases.SELECT_STAT);
        });
    });
});
