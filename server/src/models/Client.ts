import { Socket } from "socket.io";

/**
 * Represents a connected client.
 * Holds the client's socket, persistent UUID, and session-specific data like name and room ID.
 */
export default class Client {
    name: string | null;
    roomId: number | null;
    /**
     * @param socket The client's initial Socket.IO socket instance.
     * @param uuid The client's persistent unique identifier.
     */
    constructor(public socket: Socket | null, public uuid: string) {
        this.name = null;
        this.roomId = null;
    }

    /**
     * Assigns a name to the client.
     * @param name The name to set.
     */
    setName(name: string) {
        this.name = name;
    }

    /**
     * Assigns a room ID to the client.
     * @param roomId The room ID to set.
     */
    setRoomId(roomId: number | null) {
        this.roomId = roomId;
    }

    /**
     * Updates the client's socket instance on reconnection.
     * @param socket The new socket instance.
     */
    setSocket(socket: Socket | null) {
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
}
