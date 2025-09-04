import Game from "./Game.js";
import { EventEmitter } from "events";

/**
 * Represents a game room that can hold up to two clients.
 * Manages the lifecycle of a game session, from clients joining to game start.
 * Emits "gameEvent" when its Game instance emits an event.
 */
export default class Room extends EventEmitter {
    constructor(id) {
        super();
        this.id = id;
        this.clientRecords = [];
        this.game = null;
    }

    //================================================================
    // State Modifiers
    //================================================================

    /**
     * Adds a client to the room if it's not full and the client isn't already present.
     * @param {Client} client The client to add.
     * @returns {boolean} True if the client was added, false otherwise.
     */
    addClient(client) {
        const isAlreadyInRoom = this.clientRecords.some(
            (record) => record.client.uuid === client.uuid
        );
        if (this.isFull() || isAlreadyInRoom) {
            return false;
        }
        this.clientRecords.push({ client: client, isReady: false });
        return true;
    }

    /**
     * Removes a client from the room by their unique ID.
     * @param {Client} client The client to remove.
     */
    removeClient(client) {
        this.clientRecords = this.clientRecords.filter(
            (c) => c.client.uuid !== client.uuid
        );
    }

    /**
     * Sets a client's status to ready.
     * @param {string} clientUuid The UUID of the client.
     */
    setClientReady(clientUuid) {
        const clientRecord = this.clientRecords.find(
            (c) => c.client.uuid === clientUuid
        );
        if (clientRecord) {
            clientRecord.isReady = true;
        }
    }

    /**
     * Creates a new Game instance and starts the game.
     */
    startGame() {
        const participants = this.clientRecords.map((c) => ({
            uuid: c.client.uuid,
            name: c.client.name,
        }));

        this.game = new Game(participants);

        this.game.on("gameEvent", (event) => {
            this.emit("gameEvent", { roomId: this.id, ...event });
        });
    }

    /**
     * Forwards a command to the current game instance.
     * @param {OrchestratorToGameCommand} gameCommand The command to execute.
     */
    forwardGameCommand(gameCommand) {
        if (this.game) {
            this.game.executeGameCommand(gameCommand);
        }
    }

    //================================================================
    // State Queries & Getters
    //================================================================

    /**
     * Retrieves all clients in the room.
     * @returns {Client[]} An array of client instances.
     */
    getClients() {
        return this.clientRecords.map((c) => c.client);
    }

    /**
     * Retrieves the names of all clients in the room.
     * @returns {string[]} An array of client names.
     */
    getClientNames() {
        return this.clientRecords.map((c) => c.client.name);
    }

    /**
     * Gets the current phase of the game.
     * @returns {string|null} The game phase, or null if the game hasn't started.
     */
    getPhase() {
        return this.game ? this.game.phase : null;
    }

    /**
     * Checks if the room has the maximum number of clients.
     * @returns {boolean}
     */
    isFull() {
        return this.clientRecords.length >= 2;
    }

    /**
     * Checks if the room has no clients.
     * @returns {boolean}
     */
    isEmpty() {
        return this.clientRecords.length === 0;
    }

    /**
     * Checks if the room is full and all clients are ready.
     * @returns {boolean}
     */
    isReady() {
        return this.isFull() && this.clientRecords.every((c) => c.isReady);
    }

    /**
     * Returns a JSON representation of the room
     * @returns{object} The Room data
     */
    toJSON() {
        return {
            id: this.id,
            clientRecords: this.clientRecords.map((clientRecord) => {
                return {
                    isReady: clientRecord.isReady,
                    client: clientRecord.client.toJSON(),
                };
            }),
            game: this.game ? this.game.toJSON() : null,
        };
    }

    /**
     * Creates a client-safe representation of the room state.
     * @param {Client} client The client for whom the state is being prepared.
     * @returns {object} The room state object for the client.
     */
    toClientState(clientUuid) {
        const roomState = this.toJSON();
        if (roomState.game) {
            roomState.game = this.game.toClientState(clientUuid);
        }
        return roomState;
    }
}
