import { test, expect, describe, beforeEach } from "vitest";
import ClientManager from "../../src/managers/ClientManager.js";
import Client from "../models/Client.js";

describe("ClientManager", () => {
    let clientManager: ClientManager;
    const mockSocket = {} as any;
    const uuid = "uuid1";
    let client: Client;

    beforeEach(() => {
        clientManager = new ClientManager();
        client = clientManager.addClient(mockSocket, uuid);
    });

    describe("addClient", () => {
        test("sets new client in both maps", () => {
            expect(clientManager.clientsBySocket.size).toBe(1);
            expect(clientManager.clientsByUuid.size).toBe(1);
            expect(clientManager.clientsBySocket.get(mockSocket)).toBe(client);
            expect(clientManager.clientsByUuid.get(uuid)).toBe(client);
        });
    });

    describe("updateClientSocket", () => {
        test("updates the socket for a client", () => {
            const newSocket = {} as any;
            clientManager.updateClientSocket(client, newSocket);
            expect(clientManager.clientsBySocket.get(newSocket)).toBe(client);
            expect(clientManager.clientsBySocket.get(mockSocket)).toBeUndefined();
            expect(client.socket).toBe(newSocket);
        });
    });

    describe("removeClientOnDisconnect", () => {
        test("removes client from socket map but keeps in uuid map", () => {
            clientManager.removeClientOnDisconnect(client);
            expect(clientManager.clientsBySocket.get(mockSocket)).toBeUndefined();
            expect(clientManager.clientsByUuid.get(uuid)).toBe(client);
            expect(client.socket).toBeNull();
        });
    });

    describe("removeClient", () => {
        test("removes client from both maps", () => {
            clientManager.removeClient(client);
            expect(clientManager.clientsBySocket.get(mockSocket)).toBeUndefined();
            expect(clientManager.clientsByUuid.get(uuid)).toBeUndefined();
        });
    });
});
