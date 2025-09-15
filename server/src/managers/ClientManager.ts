import { Socket } from "socket.io";
import Client from "../models/Client.js";

/**
 * Manages the lifecycle and storage of all connected clients.
 * Provides a centralized way to add, retrieve, update, and remove client instances,
 * using both their transient socket and persistent UUID for lookups.
 */
export default class ClientManager {
    clientsBySocket: Map<Socket, Client> = new Map();
    clientsByUuid: Map<string, Client> = new Map();

    //================================================================
    // Public API - Client Management
    //================================================================

    /**
     * Creates a new Client instance and adds it to the manager's collections.
     * @param socket The client's socket instance.
     * @param uuid The client's persistent unique identifier.
     */
    addClient(socket: Socket, uuid: string): Client {
        const client = new Client(socket, uuid);
        this.clientsBySocket.set(client.socket!, client);
        this.clientsByUuid.set(client.uuid, client);
        return client;
    }

    /**
     * Updates the socket for a reconnecting client.
     * @param client The existing client instance.
     * @param newSocket The new socket instance for the client.
     */
    updateClientSocket(client: Client, newSocket: Socket) {
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
     * @param client The client to remove.
     */
    removeClientOnDisconnect(client: Client) {
        if (!client) return;
        this.clientsBySocket.delete(client.socket!);
        client.setSocket(null);
    }

    /**
     * Completely removes a client from the manager.
     * @param client The client to remove.
     */
    removeClient(client: Client) {
        this.clientsBySocket.delete(client.socket!);
        this.clientsByUuid.delete(client.uuid);
    }

    /**
     * Resets the session state for an array of clients.
     * @param clients The clients to reset.
     */
    resetClients(clients: Client[]) {
        clients.forEach((client: Client) => {
            client.reset();
        });
    }

    //================================================================
    // Public API - Getters
    //================================================================

    /**
     * Retrieves a client instance by their current socket.
     * @param socket The client's socket.
     */
    getClient(socket: Socket): Client | undefined {
        return this.clientsBySocket.get(socket);
    }

    /**
     * Retrieves a client instance by their persistent UUID.
     * @param uuid The client's UUID.
     */
    getClientByUuid(uuid: string): Client | null {
        return this.clientsByUuid.get(uuid) || null;
    }
}
