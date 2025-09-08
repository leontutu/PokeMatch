import Client from "../models/Client.js";

/**
 * Manages the lifecycle and storage of all connected clients.
 * Provides a centralized way to add, retrieve, update, and remove client instances,
 * using both their transient socket and persistent UUID for lookups.
 */
export default class ClientManager {
    constructor() {
        this.clientsBySocket = new Map();
        this.clientsByUuid = new Map();
    }

    //================================================================
    // Public API - Client Management
    //================================================================

    /**
     * Creates a new Client instance and adds it to the manager's collections.
     * @param {Socket} socket The client's socket instance.
     * @param {string} uuid The client's persistent unique identifier.
     * @returns {Client} The newly created client instance.
     */
    addClient(socket, uuid) {
        const client = new Client(socket, uuid);
        this.clientsBySocket.set(client.socket, client);
        this.clientsByUuid.set(client.uuid, client);
        return client;
    }

    /**
     * Updates the socket for a reconnecting client.
     * @param {Client} client The existing client instance.
     * @param {Socket} newSocket The new socket instance for the client.
     */
    updateClientSocket(client, newSocket) {
        const oldSocket = client.socket;
        if (oldSocket) {
            this.clientsBySocket.delete(oldSocket);
        }
        this.clientsBySocket.set(newSocket, client);
        client.setSocket(newSocket);
    }

    /**
     * Removes a client from the manager when their socket disconnects.
     * The client's data is kept in `clientsByUuid` for potential reconnection.
     * @param {Client} client The client to remove.
     */
    removeClientOnDisconnect(client) {
        if (!client) return;
        this.clientsBySocket.delete(client.socket);
        client.setSocket(null);
    }

    /**
     * Completely removes a client from the manager.
     * @param {Client} client The client to remove.
     */
    removeClient(client) {
        this.clientsBySocket.delete(client.socket);
        this.clientsByUuid.delete(client.uuid);
    }

    /**
     * Resets the session state for an array of clients.
     * @param {Client[]} clients The clients to reset.
     */
    resetClients(clients) {
        clients.forEach((client) => {
            client.reset();
        });
    }

    //================================================================
    // Public API - Getters
    //================================================================

    /**
     * Retrieves a client instance by their current socket.
     * @param {Socket} socket The client's socket.
     * @returns {Client|undefined}
     */
    getClient(socket) {
        return this.clientsBySocket.get(socket);
    }

    /**
     * Retrieves a client instance by their persistent UUID.
     * @param {string} uuid The client's UUID.
     * @returns {Client|null}
     */
    getClientByUuid(uuid) {
        return this.clientsByUuid.get(uuid) || null;
    }
}
