import { expect, test, describe } from "vitest";
import Room from "./Room.js";
import Client from "./Client.js";

describe("Room", () => {
    describe("addClient", () => {
        test("adds a client when room is not full", () => {
            const room = new Room(1);
            const client = new Client(null, "uuid1");
            room.addClient(client);
            expect(room.getClients()).toContain(client);
        });

        test("does not add a client when room is full", () => {
            const room = new Room(1);
            const client1 = new Client(null, "uuid1");
            const client2 = new Client(null, "uuid2");
            const client3 = new Client(null, "uuid3");
            room.addClient(client1);
            room.addClient(client2);
            room.addClient(client3);
            expect(room.getClients()).toContain(client1);
            expect(room.getClients()).toContain(client2);
            expect(room.getClients()).not.toContain(client3);
        });

        test("does not add a client that is already in the room", () => {
            const room = new Room(1);
            const client1 = new Client(null, "uuid1");
            room.addClient(client1);
            room.addClient(client1);
            expect(room.getClients()).toContain(client1);
            expect(room.getClients().length).toBe(1);
        });
    });
});
