import { Server, Socket } from "socket.io";
import { Events } from "../../../shared/constants/constants.js";
import logger from "../utils/Logger.js";
import Orchestrator from "./Orchestrator.js";
import { Server as HttpServer } from "node:http";
import { ViewRoom } from "../../../shared/types/types.js";
/**
 * SocketService
 * -------------
 * Manages all Socket.IO communication between the server and clients.
 *
 * Responsibilities:
 * - Initializes the Socket.IO server with CORS and UUID authentication.
 * - Registers event listeners for client connections and game-related actions.
 * - Delegates incoming events to the Orchestrator for business logic.
 * - Provides methods to emit server-to-client events (room updates, errors, etc.).
 *
 * Usage:
 *   const socketService = new SocketService(server, orchestrator);
 *   socketService.init();
 *
 * Key Methods:
 * - init(): Sets up middleware and event listeners for all relevant socket events.
 * - emitUpdate(socket, data): Sends the latest room/game state to a client.
 * - emitRoomFull(socket): Notifies a client that a room is full.
 * - emitRoomCrash(socket): Notifies a client that their room has crashed.
 * - emitNameError(socket): Notifies a client of a name validation error.
 * - emitActionError(socket, reason): Notifies a client of an invalid game action.
 */
export default class SocketService {
    io: Server;

    constructor(public server: HttpServer, public orchestrator: Orchestrator) {
        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });
    }

    /**
     * Initializes the Socket.IO server:
     * - Adds UUID authentication middleware.
     * - Registers all event listeners for client actions.
     */
    init() {
        this.io.use((socket, next) => {
            const uuid = socket.handshake.auth.uuid;
            if (!uuid) {
                logger.warn(`[SocketService] No UUID found for socket: ${socket.id}`);
                return next(new Error("No UUID found"));
            }
            next();
        });

        this.io.on("connection", (socket) => {
            this.orchestrator.onConnection(socket);

            socket.on("disconnect", () => {
                this.orchestrator.onDisconnect(socket);
            });

            socket.on(Events.NAME_ENTER, (payload) => {
                this.orchestrator.onNameEnter(socket, payload);
            });

            socket.on(Events.CREATE_ROOM, () => {
                this.orchestrator.onCreateRoom(socket);
            });

            socket.on(Events.JOIN_ROOM, (roomIdAsString: string) => {
                this.orchestrator.onJoinRoom(socket, roomIdAsString);
            });

            socket.on(Events.PLAY_VS_BOT, () => {
                this.orchestrator.onPlayVsBot(socket);
            });

            socket.on(Events.TOGGLE_READY, () => {
                this.orchestrator.onToggleReady(socket);
            });

            socket.on(Events.LEAVE_ROOM, () => {
                this.orchestrator.onLeaveRoom(socket);
            });

            socket.on(Events.BATTLE_END, () => {
                this.orchestrator.onBattleEnd(socket);
            });

            socket.on(Events.GAME_COMMAND, (data) => {
                this.orchestrator.onGameCommand(socket, data);
            });
        });
    }

    // Emits the latest room/game state to a client.
    emitUpdate(socket: Socket, viewRoom: ViewRoom) {
        socket.emit(Events.UPDATE, viewRoom);
    }

    // Notifies a client that a room is full.
    emitRoomFull(socket: Socket) {
        socket.emit(Events.ROOM_FULL);
    }

    // Notifies a client that their room has crashed.
    emitRoomCrash(socket: Socket) {
        socket.emit(Events.ROOM_CRASH);
    }

    // Notifies a client that their name was accepted.
    emitNameValid(socket: Socket) {
        socket.emit(Events.NAME_VALID);
    }

    // Notifies a client of a name validation error.
    emitNameError(socket: Socket) {
        socket.emit(Events.NAME_ERROR);
    }

    // Notifies a client that the entered room ID was not found.
    emitBadRoomId(socket: Socket) {
        socket.emit(Events.BAD_ROOM_ID);
    }

    // Notifies a client of an invalid select stat action.
    emitActionError(socket: Socket, reason = null) {
        socket.emit(Events.SELECT_STAT_ERROR, { reason });
    }
}
