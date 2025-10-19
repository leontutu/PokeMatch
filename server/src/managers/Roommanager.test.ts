import { test, expect, describe, vi, beforeEach } from "vitest";
import { ROOM_SHUTDOWN_TIMEOUT_MS } from "../constants/constants.js";
import RoomNotFoundError from "../errors/RoomNotFoundError.js";
import RoomManager from "../../src/managers/RoomManager.js";
import Client from "../models/Client.js";

describe("RoomManager", () => {
    let client = createMockClient();
    let roomManager: RoomManager;
    let roomId: number;
    let emittedEvent = undefined as any;

    beforeEach(() => {
        roomManager = new RoomManager();
        roomManager.on("newRoom", (event) => {
            emittedEvent = event;
        });
        client = createMockClient();
        roomId = roomManager.assignClientToNewRoom(client);
    });

    describe("assignClientToNewRoom", () => {
        test("assigns a client to a new room", () => {
            expect(roomManager.rooms.has(roomId)).toBe(true);
            expect(roomManager.getRoom(roomId).clientRecords[0].client).toBe(client);
        });
    });
    describe("createNewRoom", () => {
        test("creating a new room emits `newRoom` event", () => {
            expect(emittedEvent).toBeDefined();
            expect(emittedEvent.id).toBe(roomId);
            expect(emittedEvent).toBe(roomManager.getRoom(roomId));
        });
    });

    describe("assignClientToPublicRoom", () => {
        test("assigns to existing room with space", () => {
            const newClient = createMockClient("uuid2");
            const roomId2 = roomManager.assignClientToPublicRoom(newClient);
            expect(roomId).toBe(roomId2);
            expect(roomManager.getRoom(roomId).clientRecords.length).toBe(2);
        });
    });

    describe("removeClientFromRoom", () => {
        test("removes client and deletes empty room", () => {
            roomManager.removeClientFromRoom(roomId, client);
            expect(roomManager.rooms.has(roomId)).toBe(false);
        });

        test("deletes room if empty", () => {
            roomManager.removeClientFromRoom(roomId, client);
            expect(roomManager.rooms.has(roomId)).toBe(false);
        });

        test("throws RoomNotFoundError if room doesn't exist", () => {
            expect(() => roomManager.removeClientFromRoom(999, client)).toThrowError(RoomNotFoundError);
        });
    });

    describe("getRoom", () => {
        test("getRoom throws RoomNotFoundError if room doesn't exist", () => {
            expect(() => roomManager.getRoom(999)).toThrowError(RoomNotFoundError);
        });
    });

    describe("addClientToRoom", () => {
        test("throws RoomNotFoundError if room doesn't exist", () => {
            const newClient = createMockClient("uuid2");
            expect(() => roomManager.addClientToRoom(999, newClient)).toThrowError(RoomNotFoundError);
        });
    });

    describe("forwardGameCommand", () => {
        test("throws RoomNotFoundError if room doesn't exist", () => {
            const mockCommand = {} as any;
            expect(() => roomManager.forwardGameCommand(999, mockCommand)).toThrowError(
                RoomNotFoundError
            );
        });
    });

    describe("scheduleShutdownIfInactive", () => {
        test("fires if room is inactive", () => {
            client.socket = null; // simulate disconnected client
            roomManager.scheduleShutdownIfInactive(roomId);
            expect(roomManager.roomTimeouts.has(roomId)).toBe(true);
        });

        test("deletes room after timeout", () => {
            vi.useFakeTimers();
            client.socket = null;
            roomManager.scheduleShutdownIfInactive(roomId);
            expect(roomManager.hasRoom(roomId)).toBe(true);
            vi.advanceTimersByTime(ROOM_SHUTDOWN_TIMEOUT_MS);
            expect(roomManager.hasRoom(roomId)).toBe(false);
            expect(roomManager.roomTimeouts.has(roomId)).toBe(false);
            vi.useRealTimers();
        });
    });

    describe("clearTimeoutForRoom", () => {
        test("prevents shutdown", () => {
            vi.useFakeTimers();
            client.socket = null;
            roomManager.scheduleShutdownIfInactive(roomId);
            roomManager.clearTimeoutForRoom(roomId);
            vi.advanceTimersByTime(ROOM_SHUTDOWN_TIMEOUT_MS);
            expect(roomManager.hasRoom(roomId)).toBe(true);
            vi.useRealTimers();
        });
    });
});

function createMockClient(uuid: string = "uuid1"): Client {
    const mockSocket = {} as any;
    return new Client(mockSocket, uuid);
}
