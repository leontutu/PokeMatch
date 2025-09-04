/**
 * Represents a connected client.
 * Holds the client's socket, persistent UUID, and session-specific data like name and room ID.
 */
export default class Client {
    /**
     * @param {Socket} socket The client's initial Socket.IO socket instance.
     * @param {string} uuid The client's persistent unique identifier.
     */
    constructor(socket, uuid) {
        this.socket = socket;
        this.uuid = uuid; // Persistent ID across connections
        this.name = null;
        this.roomId = null;
    }

    /**
     * Assigns a name to the client.
     * @param {string} name The name to set.
     */
    setName(name) {
        this.name = name;
    }

    /**
     * Assigns a room ID to the client.
     * @param {string|null} roomId The room ID to set.
     */
    setRoomId(roomId) {
        this.roomId = roomId;
    }

    /**
     * Updates the client's socket instance on reconnection.
     * @param {Socket} socket The new socket instance.
     */
    setSocket(socket) {
        this.socket = socket;
    }

    /**
     * Resets the client's session state (name and room ID),
     * typically used when a room crashes or the client leaves.
     */
    reset() {
        this.name = null;
        this.roomId = null;
    }

    /**
     * Returns a JSON representation of the client without socket
     * @returns {object} The client Data
     */
    toJSON() {
        return {
            uuid: this.uuid,
            name: this.name,
            roomId: this.roomId,
        };
    }
}
