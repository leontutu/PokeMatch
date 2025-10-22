import { GameEvents } from "../constants/constants.js";
import { Timings, GameCommands } from "../../../shared/constants/constants.js";
import logger from "../utils/Logger.js";
import RoomNotFoundError from "../errors/RoomNotFoundError.js";
import OrchestratorToGameCommand from "../commands/OrchestratorToGameCommand.js";
import PokeAPIClient from "../clients/PokeAPIClient.js";
import RoomManager from "../managers/RoomManager.js";
import ClientManager from "../managers/ClientManager.js";
import { createPokemonFromApiData } from "../factories/pokemonFactory.js";
import { assertIsDefined, delay } from "../utils/utils.js";
import { isValidName, isValidRoomId } from "../../../shared/utils/validation.js";
import SocketService from "./SocketService.js";
import { Socket } from "socket.io";
import Client from "../models/Client.js";
import GameToOrchestratorCommand from "../commands/GameToOrchestratorCommand.js";
import { mapRoomToViewRoom } from "../mappers/mappers.js";
import startBotClient from "../bot-client/botClient.js";

const PORT = process.env.PORT || `3001`;

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
     * @param socketService The socket service instance.
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
            if (client.socket) {
                logger.log(
                    `[Orchestrator] Duplicate connection attempt for client UUID: ${client.uuid}`
                );
                this.socketService.emitDuplicateUUID(socket);
                return;
            }
            this.clientManager.updateClientSocket(client, socket);
            logger.log(`[Orchestrator] Client reconnected: ${client.uuid}`);
            // If the client was in a room, send them the latest state.
            if (client.roomId) {
                if (this.roomManager.hasRoom(client.roomId)) {
                    this.roomManager.clearTimeoutForRoom(client.roomId);
                    this.#updateAllRoomClients(client.roomId);
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
     * @param socket The client's socket instance.
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
     * Validates the name and emits an event to the client based on the result.
     * @param socket The client's socket instance.
     * @param payload The event payload containing the client's name.
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
        logger.debug(`[Orchestrator] Name entered: ${name}`);
        this.socketService.emitNameValid(socket);
    }

    /**
     * Handles a client creating a new room.
     * @param socket The client's socket instance.
     */
    onCreateRoom(socket: Socket) {
        const client = this.clientManager.getClient(socket);
        assertIsDefined(
            client,
            `[Orchestrator] onCreateRoom called for socket ${socket.id} which is not associated with a client.`
        );

        const roomId = this.#assignClientToNewRoom(client);

        this.#handleRoomErrors(() => {
            this.#updateAllRoomClients(roomId);
        }, socket);
    }

    /**
     * Handles a client requesting to play against an bot opponent.
     * @param socket The client's socket instance.
     */
    onPlayVsBot(socket: Socket) {
        const client = this.clientManager.getClient(socket);
        assertIsDefined(
            client,
            `[Orchestrator] onPlayVsAI called for socket ${socket.id} which is not associated with a client.`
        );
        const roomId = this.#assignClientToNewRoomWithBot(client);

        this.#handleRoomErrors(() => {
            this.#updateAllRoomClients(roomId);
        }, socket);
    }

    /**
     * Handles a client joining a room.
     * @param socket The client's socket instance.
     * @param roomId The ID of the room to join.
     */
    onJoinRoom(socket: Socket, roomIdAsString: string) {
        const client = this.clientManager.getClient(socket);
        assertIsDefined(
            client,
            `[Orchestrator] onJoinRoom called for socket ${socket.id} which is not associated with a client.`
        );

        const roomId = parseInt(roomIdAsString, 10);
        if (
            !isValidRoomId(roomIdAsString) ||
            !this.roomManager.hasRoom(roomId) ||
            this.roomManager.isRoomFull(roomId)
        ) {
            logger.warn(`[Orchestrator] Bad roomId entered: ${roomIdAsString}`);
            this.socketService.emitBadRoomId(socket);
            return;
        }

        this.#handleRoomErrors(() => {
            this.roomManager.addClientToRoom(roomId, client);
            client.setRoomId(roomId);
            this.#updateAllRoomClients(roomId);
        }, socket);
        logger.debug(`[Orchestrator] ${client.name} joined room ${roomId}`);
    }

    /**
     * Handles a client pressing ready button. Unreadies the client if they were already ready.
     * If all clients in the room are ready, the game begins.
     * @param socket The client's socket instance.
     */
    onToggleReady(socket: Socket) {
        const client = this.clientManager.getClient(socket);
        const roomId = client.roomId;

        assertIsDefined(
            roomId,
            `[Orchestrator] onToggleReady called for client ${client.uuid} who is not in a room.`
        );

        this.#handleRoomErrors(() => {
            this.roomManager.toggleClientOfRoomReady(roomId, client.uuid);
            logger.debug(`[Orchestrator] ${client.name} toggled ready in room ${roomId}`);
            this.#updateAllRoomClients(roomId);

            if (this.roomManager.isRoomReady(roomId)) {
                this.#startGame(roomId);
            }
        }, socket);
    }

    /**
     * Handles a client choosing to leave their current room.
     * @param socket The client's socket instance.
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
     * Handles a client signaling they have finished watching the battle phase animation.
     * @param socket The client's socket instance.
     */
    onBattleEnd(socket: Socket) {
        const client = this.clientManager.getClient(socket);
        const roomId = client.roomId;

        assertIsDefined(
            roomId,
            `[Orchestrator] onBattlePhaseFinished called for client ${client.uuid} who is not in a room.`
        );

        this.#handleRoomErrors(() => {
            // line below has an effect the first time it's called in a battle phase
            this.#sendGameCommand(roomId, OrchestratorToGameCommand.fromSystem(GameCommands.BATTLE_END));
            this.#updateRoomClient(roomId, client);
        }, socket);
    }

    /**
     * Handles an in-game action sent from a client.
     * @param socket The client's socket instance.
     * @param data The command data from the client.
     */
    onGameCommand(socket: Socket, data: any) {
        const client = this.clientManager.getClient(socket);
        const roomId = client.roomId;

        assertIsDefined(
            roomId,
            `[Orchestrator] onGameCommand called for client ${client.uuid} who is not in a room.`
        );

        logger.debug(`[Orchestrator] Game action from ${client.name}: ${data.actionType}`);

        const gameCommand = OrchestratorToGameCommand.fromClient(
            data.actionType,
            data.payload,
            client.uuid
        );

        this.#handleRoomErrors(() => {
            this.#sendGameCommand(roomId, gameCommand);
            this.#updateAllRoomClients(roomId);
        }, socket);
    }

    //================================================================
    // Private Game Flow Logic
    //================================================================

    /**
     * Handles events emitted from a Game instance.
     * This acts as the bridge between the pure Game model and the application layer.
     * @param event The event emitted by the game.
     */
    async handleGameEvent(event: GameToOrchestratorCommand) {
        assertIsDefined(event.roomId, "[Orchestrator] Received game event without roomId.");
        const roomId = event.roomId;

        logger.debug(`[Orchestrator] Game event: ${event.eventType} from room ${event.roomId}`);
        this.#handleRoomErrors(async () => {
            switch (event.eventType) {
                case GameEvents.ALL_SELECTED:
                    this.#onAllSelected(roomId);
                    break;
                case GameEvents.INVALID_STAT_SELECT:
                    this.#onInvalidStatSelect(roomId, event.payload, event.clientId);
                    break;
                case GameEvents.NEW_MATCH:
                    this.#onNewMatch(roomId);
                    break;
                default:
                    logger.warn(`[Orchestrator] Unknown event type: ${event.eventType}`);
            }
        });
    }

    #onAllSelected(roomId: number) {
        logger.debug(`[Orchestrator] Starting battle for room: ${roomId}`);
        this.#updateAllRoomClients(roomId);
    }

    #onInvalidStatSelect(roomId: number, payload: any, clientId?: string | null) {
        logger.warn(`[Orchestrator] Invalid stat select in room ${roomId}: ${payload}`);
        const client = this.clientManager.getClientByUuid(clientId!);
        if (client) {
            this.socketService.emitActionError(client.socket!, payload);
        }
    }

    async #onNewMatch(roomId: number) {
        logger.log(`[Orchestrator] Starting new match for room: ${roomId}`);
        await this.#assignNewPokemon(roomId);
        this.#updateAllRoomClients(roomId);
    }

    /**
     * Initiates a new game in a room and assigns the first Pokémon.
     * @param roomId The ID of the room where the game will start.
     */
    async #startGame(roomId: number) {
        logger.log(`[Orchestrator] Game starting for room: ${roomId}`);
        this.roomManager.startGame(roomId);
        await this.#assignNewPokemon(roomId);
        this.#updateAllRoomClients(roomId);
    }

    /**
     * Fetches two random Pokémon and sends a command to assign them to the players.
     * @param roomId The ID of the room.
     */
    async #assignNewPokemon(roomId: number) {
        const pokemon1 = await this.pokeAPIClient.getRandomPokemon();
        const pokemon2 = await this.pokeAPIClient.getRandomPokemon();

        const gameCommand = OrchestratorToGameCommand.fromSystem(GameCommands.ASSIGN_NEW_POKEMON, [
            createPokemonFromApiData(pokemon1),
            createPokemonFromApiData(pokemon2),
        ]);

        this.#sendGameCommand(roomId, gameCommand);
        this.#startSelectStatTimer(roomId);
    }

    /**
     * Starts a timer that, after a delay, sends the command to transition to the stat selection phase.
     * @param roomId The ID of the room.
     */
    #startSelectStatTimer(roomId: number) {
        delay(Timings.POKEMON_REVEAL_DURATION).then(() => {
            this.#handleRoomErrors(() => {
                this.#sendGameCommand(
                    roomId,
                    OrchestratorToGameCommand.fromSystem(GameCommands.START_SELECT_STAT)
                );
            });
            this.#updateAllRoomClients(roomId);
        });
    }

    /**
     * Forcefully shuts down a room, notifies clients, and cleans up resources.
     * @param roomId The ID of the room to shut down.
     * @param error The error that caused the shutdown.
     */
    #shutDownRoom(roomId: number, error: Error) {
        logger.warn(`[Orchestrator] Shutting down room ${roomId} due to error: ${error.message}`);
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
    #updateAllRoomClients(roomId: number) {
        this.#forEachRoomClient(roomId, (client: Client) => {
            if (!client.socket) return;
            this.#updateRoomClient(roomId, client);
        });
    }

    /**
     * Sends the latest game state to a specific client in a specific room.
     * @param roomId The ID of the room to update.
     * @param client The client to update.
     */
    #updateRoomClient(roomId: number, client: Client) {
        if (!client.socket) return;
        const room = this.roomManager.getRoom(roomId);
        const viewRoom = mapRoomToViewRoom(room, client.uuid);
        this.socketService.emitUpdate(client.socket, viewRoom);
    }

    //================================================================
    // Private Helpers
    //================================================================

    #assignClientToPublicRoom(client: Client): number {
        const roomId = this.roomManager.assignClientToPublicRoom(client);
        client.setRoomId(roomId);
        return roomId;
    }

    #assignClientToNewRoom(client: Client): number {
        const roomId = this.roomManager.assignClientToNewRoom(client);
        client.setRoomId(roomId);
        return roomId;
    }

    #assignClientToNewRoomWithBot(client: Client): number {
        const roomId = this.roomManager.assignClientToNewRoom(client);
        client.setRoomId(roomId);
        startBotClient(PORT, roomId);
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
            if (error instanceof RoomNotFoundError) {
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
