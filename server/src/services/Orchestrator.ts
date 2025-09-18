import { GAME_EVENTS } from "../constants/constants.js";
import { TIMINGS, GAME_COMMANDS } from "../../../shared/constants/constants.js";
import logger from "../utils/Logger.js";
import RoomNotFoundException from "../exceptions/RoomNotFoundException.js";
import OrchestratorToGameCommand from "../commands/OrchestratorToGameCommand.js";
import PokeAPIClient from "../clients/PokeAPIClient.js";
import RoomManager from "../managers/RoomManager.js";
import ClientManager from "../managers/ClientManager.js";
import { createPokemonFromApiData } from "../factories/pokemonFactory.js";
import { assertIsDefined, delay } from "../utils/utils.js";
import { isValidName } from "../../../shared/utils/validation.js";
import SocketService from "./SocketService.js";
import { Socket } from "socket.io";
import Client from "../models/Client.js";
import GameToOrchestratorCommand from "../commands/GameToOrchestratorCommand.js";

/**
 * The central controller of the application.
 * It coordinates all major components (ClientManager, RoomManager, SocketService)
 * and orchestrates the overall application flow, from client connection to game completion.
 */
export default class Orchestrator {
    private _socketService: SocketService | null = null;

    constructor(
        public roomManager: RoomManager,
        public clientManager: ClientManager,
        public pokeAPIClient: PokeAPIClient
    ) {
        // Listen for events emitted by the RoomManager. This allows the Orchestrator
        // to attach a game event listener to each newly created room.
        roomManager.on("newRoom", (room) => {
            room.on("gameEvent", (event: GameToOrchestratorCommand) => {
                this.handleGameEvent(event);
            });
        });
    }

    /**
     * Sets the SocketService instance for the Orchestrator.
     * This is used to break a circular dependency between Orchestrator and SocketService.
     * @param {SocketService} socketService The socket service instance.
     */
    setSocketService(socketService: SocketService) {
        this._socketService = socketService;
    }

    public get socketService(): SocketService {
        if (!this._socketService) {
            throw new Error(
                "SocketService has not been set on Orchestrator. Call setSocketService first."
            );
        }
        return this._socketService;
    }

    //================================================================
    // Public API - Socket Event Handlers
    //================================================================

    /**
     * Handles a new client connection.
     * Identifies if the client is new or returning via their UUID and updates their state.
     * @param socket The client's socket instance.
     */
    onConnection(socket: Socket) {
        const uuid = socket.handshake.auth.uuid;
        let client = this.clientManager.getClientByUuid(uuid);

        if (client) {
            this.clientManager.updateClientSocket(client, socket);
            logger.log(`[Orchestrator] Client reconnected: ${client.uuid}`);
            // If the client was in a room, send them the latest state.
            if (client.roomId) {
                if (this.roomManager.hasRoom(client.roomId)) {
                    this.roomManager.clearTimeoutForRoom(client.roomId);
                    this.#updateRoomClients(client.roomId);
                } else {
                    this.clientManager.resetClients([client]);
                }
            }
        } else {
            client = this.clientManager.addClient(socket, uuid);
            logger.log(`[Orchestrator] New client connected: ${client.uuid}`);
        }
    }

    /**
     * Handles a client disconnection.
     * @param {Socket} socket The client's socket instance.
     */
    onDisconnect(socket: Socket) {
        const client = this.clientManager.getClient(socket);
        if (!client) return;

        this.clientManager.removeClientOnDisconnect(client);
        const name = client.name || "Anon";

        if (client.roomId) {
            this.#handleRoomErrors(() => {
                this.roomManager.scheduleShutdownIfInactive(client.roomId!);
            }, socket);
        }
        logger.log(`[Orchestrator] ${name} disconnected.`);
    }

    /**
     * Handles a client submitting their name.
     * Validates the name and assigns the client to an available room.
     * @param {Socket} socket The client's socket instance.
     * @param {object} payload The event payload containing the client's name.
     */
    onNameEnter(socket: Socket, payload: string) {
        const name = payload;
        const client = this.clientManager.getClient(socket);

        if (!isValidName(name)) {
            logger.warn(`[Orchestrator] Invalid name entered: ${name}`);
            this.socketService.emitNameError(socket);
            return;
        }

        client.setName(name);
        logger.log(`[Orchestrator] Name entered: ${name}`);
        const roomId = this.#assignClientToRoom(client);

        this.#handleRoomErrors(() => {
            this.#updateRoomClients(roomId);
        }, socket);
    }

    /**
     * Handles a client signaling they are ready to start the game.
     * If all clients in the room are ready, the game begins.
     * @param socket The client's socket instance.
     */
    onReady(socket: Socket) {
        const client = this.clientManager.getClient(socket);
        const roomId = client.roomId;

        assertIsDefined(
            roomId,
            `[Orchestrator] onReady called for client ${client.uuid} who is not in a room.`
        );

        this.#handleRoomErrors(() => {
            this.roomManager.setClientOfRoomReady(roomId, client.uuid);
            logger.log(
                `[Orchestrator] ${client.name} is ready in room ${roomId}`
            );
            this.#updateRoomClients(roomId);

            if (this.roomManager.isRoomReady(roomId)) {
                this.#startGame(roomId);
            }
        }, socket);
    }

    /**
     * Handles a client choosing to leave their current room.
     * @param {Socket} socket The client's socket instance.
     */
    onLeaveRoom(socket: Socket) {
        const client = this.clientManager.getClient(socket);
        const roomId = client.roomId;
        assertIsDefined(
            roomId,
            `[Orchestrator] onLeaveRoom called for client ${client.uuid} who is not in a room.`
        );

        this.#handleRoomErrors(() => {
            this.roomManager.removeClientFromRoom(roomId, client);
            client.setRoomId(null);
        }, socket);
    }

    /**
     * Handles an in-game action sent from a client.
     * @param {Socket} socket The client's socket instance.
     * @param {object} data The command data from the client.
     */
    onGameCommand(socket: Socket, data: any) {
        const client = this.clientManager.getClient(socket);
        const roomId = client.roomId;

        assertIsDefined(
            roomId,
            `[Orchestrator] onGameCommand called for client ${client.uuid} who is not in a room.`
        );

        logger.log(
            `[Orchestrator] Game action from ${client.name}: ${data.actionType}`
        );

        const gameCommand = OrchestratorToGameCommand.fromClient(
            data.actionType,
            data.payload,
            client.uuid
        );

        this.#handleRoomErrors(() => {
            this.#sendGameCommand(roomId, gameCommand);
            this.#updateRoomClients(roomId);
        }, socket);
    }

    //================================================================
    // Private Game Flow Logic
    //================================================================

    /**
     * Handles events emitted from a Game instance.
     * This acts as the bridge between the pure Game model and the application layer.
     * @param {GameToOrchestratorCommand} event The event emitted by the game.
     */
    async handleGameEvent(event: GameToOrchestratorCommand) {
        assertIsDefined(
            event.roomId,
            "[Orchestrator] Received game event without roomId."
        );
        const roomId = event.roomId;

        logger.log(
            `[Orchestrator] Game event: ${event.eventType} from room ${event.roomId}`
        );
        this.#handleRoomErrors(async () => {
            switch (event.eventType) {
                case GAME_EVENTS.ALL_SELECTED:
                    this.#updateRoomClients(roomId);
                    this.#startBattle(roomId);
                    break;
                case GAME_EVENTS.INVALID_STAT_SELECT:
                    const client = this.clientManager.getClientByUuid(
                        event.clientId!
                    );
                    if (client) {
                        this.socketService.emitActionError(
                            client.socket!,
                            event.payload
                        );
                    }
                    break;
                case GAME_EVENTS.NEW_BATTLE:
                    await this.#assignNewPokemon(roomId);
                    this.#updateRoomClients(roomId);
                    break;
                default:
                    logger.warn(
                        `[Orchestrator] Unknown event type: ${event.eventType}`
                    );
            }
        });
    }

    /**
     * Initiates a new game in a room and assigns the first Pokémon.
     * @param roomId The ID of the room where the game will start.
     */
    async #startGame(roomId: number) {
        logger.log(`[Orchestrator] Game starting for room: ${roomId}`);
        this.roomManager.startGame(roomId);
        await this.#assignNewPokemon(roomId);
        this.#updateRoomClients(roomId);
    }

    /**
     * Starts the battle phase after a delay, then sends the BATTLE_END command.
     * @param roomId The ID of the room in battle.
     */
    #startBattle(roomId: number) {
        logger.log(`[Orchestrator] Starting battle for room: ${roomId}`);
        delay(TIMINGS.BATTLE_DURATION).then(() => {
            this.#handleRoomErrors(() => {
                this.#sendGameCommand(
                    roomId,
                    OrchestratorToGameCommand.fromSystem(
                        GAME_COMMANDS.BATTLE_END
                    )
                );
                this.#updateRoomClients(roomId);
            });
        });
    }

    /**
     * Fetches two random Pokémon and sends a command to assign them to the players.
     * @param roomId The ID of the room.
     */
    async #assignNewPokemon(roomId: number) {
        const pokemon1 = await this.pokeAPIClient.getRandomPokemon();
        const pokemon2 = await this.pokeAPIClient.getRandomPokemon();

        const gameCommand = OrchestratorToGameCommand.fromSystem(
            GAME_COMMANDS.ASSIGN_NEW_POKEMON,
            [
                createPokemonFromApiData(pokemon1),
                createPokemonFromApiData(pokemon2),
            ]
        );

        this.#sendGameCommand(roomId, gameCommand);
    }

    /**
     * Forcefully shuts down a room, notifies clients, and cleans up resources.
     * @param roomId The ID of the room to shut down.
     * @param {Error} exception The error that caused the shutdown.
     */
    #shutDownRoom(roomId: number, exception: Error) {
        logger.warn(
            `[Orchestrator] Shutting down room ${roomId} due to error: ${exception.message}`
        );
        const clients = this.roomManager.getClientsOfRoom(roomId);
        clients.forEach((client) => {
            this.socketService.emitRoomCrash(client.socket!);
        });
        this.clientManager.resetClients(clients);
        this.roomManager.deleteRoom(roomId);
    }

    /**
     * Sends the latest game state to every client in a specific room.
     * @param roomId The ID of the room to update.
     */
    #updateRoomClients(roomId: number) {
        this.#forEachRoomClient(roomId, (client: Client) => {
            if (!client.socket) return;
            const room = this.roomManager.getRoom(roomId);
            const clientGameState = room.toClientState(client.uuid);
            this.socketService.emitUpdate(client.socket, clientGameState);
        });
    }

    //================================================================
    // Private Helpers
    //================================================================

    #assignClientToRoom(client: Client): number {
        const roomId = this.roomManager.assignClientToRoom(client);
        client.setRoomId(roomId);
        return roomId;
    }

    #sendGameCommand(roomId: number, gameCommand: OrchestratorToGameCommand) {
        this.roomManager.forwardGameCommand(roomId, gameCommand);
    }

    #forEachRoomClient(roomId: number, callback: (client: Client) => void) {
        this.roomManager.getClientsOfRoom(roomId).forEach(callback);
    }

    /**
     * A centralized error handler for operations that might fail due to a missing room.
     * @param fn The function to execute within the try...catch block.
     * @param socket The client socket to notify if an error occurs.
     */
    #handleRoomErrors(fn: Function, socket: Socket | null = null) {
        try {
            return fn();
        } catch (error) {
            if (error instanceof RoomNotFoundException) {
                logger.warn(`Handled expected error: ${error.message}`);
                if (socket) {
                    this.socketService.emitRoomCrash(socket);
                }
            } else {
                throw error;
            }
        }
    }
}
