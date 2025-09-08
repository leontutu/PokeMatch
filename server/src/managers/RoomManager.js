import Room from "../models/Room.js";
import logger from "../utils/Logger.js";
import RoomNotFoundException from "../exceptions/RoomNotFoundException.js";
import { EventEmitter } from "events";
import { ROOM_SHUTDOWN_TIMEOUT_MS } from "../constants.js";

/**
 * Manages the lifecycle and storage of all game rooms.
 *
 * This class acts as a centralized registry for all active Room instances. It handles
 * creating new rooms, finding available rooms for players, and cleaning up empty rooms.
 * The Orchestrator delegates all room-related tasks to this manager, abstracting away
 * the direct management of the room collection.
 */
export default class RoomManager extends EventEmitter {
    constructor() {
        super();
        this.rooms = new Map();
        this.roomTimeouts = new Map();
        this.id = 1;
    }

    //================================================================
    // Public API - High-Level Actions
    //================================================================

    /**
     * Finds an available room or creates a new one for the client.
     * @param {Client} client The client to assign to a room.
     * @returns {string} The ID of the room the client was assigned to.
     * @throws {RoomNotFoundException} If the newly created room is not found, which indicates an internal error.
     */
    assignClientToRoom(client) {
        let roomId;
        if (this.rooms.size === 0) {
            roomId = this.#createNewRoom();
        } else {
            const roomWithEmptySlot = this.#getRoomWithEmptySlot();
            if (roomWithEmptySlot) {
                roomId = roomWithEmptySlot.id;
            } else {
                roomId = this.#createNewRoom();
            }
        }
        this.addClientToRoom(roomId, client);
        return roomId;
    }

    /**
     * Adds a client to a specific room.
     * @param {string} roomId The ID of the room.
     * @param {Client} client The client to add.
     * @throws {RoomNotFoundException}
     */
    addClientToRoom(roomId, client) {
        const room = this.getRoom(roomId);
        room.addClient(client);
    }

    /**
     * Removes a client from a specific room and deletes the room if it becomes empty.
     * @param {string} roomId The ID of the room.
     * @param {Client} client The client to remove.
     * @throws {RoomNotFoundException}
     */
    removeClientFromRoom(roomId, client) {
        const room = this.getRoom(roomId);
        room.removeClient(client);
        if (!this.#deleteRoomIfEmpty(room)) {
            this.scheduleShutdownIfInactive(roomId);
        }
    }

    /**
     * Forwards a game command to the appropriate room's game instance.
     * @param {string} roomId The ID of the room.
     * @param {GameCommand} gameCommand The command to forward.
     * @throws {RoomNotFoundException}
     */
    forwardGameCommand(roomId, gameCommand) {
        const room = this.getRoom(roomId);
        room.forwardGameCommand(gameCommand);
    }

    /**
     * Sets a client's status to ready within a room.
     * @param {string} roomId The ID of the room.
     * @param {string} clientId The ID of the client.
     * @throws {RoomNotFoundException}
     */
    setClientOfRoomReady(roomId, clientId) {
        this.getRoom(roomId).setClientReady(clientId);
    }

    /**
     * Starts the game in a specific room with the given Pokémon.
     * @param {string} roomId The ID of the room.
     * @param {object} pokemon1 The first Pokémon.
     * @param {object} pokemon2 The second Pokémon.
     * @throws {RoomNotFoundException}
     */
    startGame(roomId, pokemon1, pokemon2) {
        this.getRoom(roomId).startGame(pokemon1, pokemon2);
    }

    /**
     * Deletes a room explicitly by its ID.
     * @param {string} roomId The ID of the room to delete.
     * @throws {RoomNotFoundException}
     */
    deleteRoom(roomId) {
        if (!this.#hasRoom(roomId)) {
            throw new RoomNotFoundException(roomId);
        }
        this.rooms.delete(roomId);
        logger.log(`[RoomManager] Room ${roomId} has been deleted.`);
    }

    //================================================================
    // Public API - State Getters & Queries
    //================================================================

    /**
     * Retrieves the room instance associated with the given room ID.
     * @param {string} roomId - The unique identifier of the room to retrieve.
     * @returns {Room} The room instance corresponding to the provided roomId.
     * @throws {RoomNotFoundException} If the room with the specified ID does not exist.
     */
    getRoom(roomId) {
        if (!this.#hasRoom(roomId)) {
            throw new RoomNotFoundException(roomId);
        }
        return this.rooms.get(roomId);
    }

    hasRoom(roomId) {
        return this.#hasRoom(roomId);
    }

    /**
     * Retrieves all clients from a specific room.
     * @param {string} roomId The ID of the room.
     * @returns {Client[]} An array of clients in the room.
     * @throws {RoomNotFoundException}
     */
    getClientsOfRoom(roomId) {
        return this.getRoom(roomId).getClients();
    }

    /**
     * Gets the current game phase of a room.
     * @param {string} roomId The ID of the room.
     * @returns {string} The current game phase.
     * @throws {RoomNotFoundException}
     */
    getPhase(roomId) {
        return this.getRoom(roomId).getPhase();
    }

    /**
     * Checks if a room is full.
     * @param {string} roomId The ID of the room.
     * @returns {boolean}
     * @throws {RoomNotFoundException}
     */
    isRoomFull(roomId) {
        return this.getRoom(roomId).isFull();
    }

    /**
     * Checks if all clients in a room are ready.
     * @param {string} roomId The ID of the room.
     * @returns {boolean}
     * @throws {RoomNotFoundException}
     */
    isRoomReady(roomId) {
        return this.getRoom(roomId).isReady();
    }

    /**
     * Schedules a room for shutdown if all clients are inactive.
     * @param {string} roomId The ID of the room.
     */
    scheduleShutdownIfInactive(roomId) {
        const room = this.rooms.get(roomId);
        // checks if any clients are active
        if (!room.clientRecords.some((cr) => cr.client.socket)) {
            logger.log(
                `[RoomManager] Scheduling shutdown for inactive room ${roomId} in ${
                    ROOM_SHUTDOWN_TIMEOUT_MS / 1000
                } seconds.`
            );
            this.roomTimeouts.set(
                roomId,
                setTimeout(() => {
                    this.deleteRoom(roomId);
                    this.roomTimeouts.delete(roomId);
                }, ROOM_SHUTDOWN_TIMEOUT_MS)
            );
        }
    }

    /**
     * Clears any scheduled shutdown for a room, typically called when a client reconnects.
     * @param {string} roomId The ID of the room.
     */
    clearTimeoutForRoom(roomId) {
        if (this.roomTimeouts.has(roomId)) {
            logger.log(
                `[RoomManager] Clearing scheduled shutdown for room ${roomId} due to client activity.`
            );
            clearTimeout(this.roomTimeouts.get(roomId));
            this.roomTimeouts.delete(roomId);
        }
    }

    //================================================================
    // Private Helper Methods
    //================================================================

    #createNewRoom() {
        const newRoomId = this.#getNewId();
        const newRoom = new Room(newRoomId);
        this.rooms.set(newRoomId, newRoom);
        logger.log(`[RoomManager] New room created with ID: ${newRoomId}`);
        this.emit("newRoom", newRoom);
        return newRoomId;
    }

    #getRoomWithEmptySlot() {
        for (const room of this.rooms.values()) {
            if (!room.isFull() && !room.game) {
                return room;
            }
        }
        return null;
    }

    #deleteRoomIfEmpty(room) {
        if (room && room.isEmpty()) {
            this.deleteRoom(room.id);
            return true;
        }
        return false;
    }

    #hasRoom(roomId) {
        return this.rooms.has(roomId);
    }

    #getNewId() {
        const roomId = this.id;
        this.id++;
        return roomId;
    }
}
