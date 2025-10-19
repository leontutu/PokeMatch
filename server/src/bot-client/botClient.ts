import { io, Socket } from "socket.io-client";
import { Events, GameCommands, GamePhases, StatNames } from "../../../shared/constants/constants.js";
import { delay } from "../utils/utils.js";
import { ViewRoom } from "../../../shared/types/types.js";
import logger from "../utils/Logger.js";

const MAX_IDLE_TIME = 1200000; // 20 minutes

/**
 * Launches a bot client that connects to a specified game room.
 *
 * The bot automatically readies up and participates in the game by selecting
 * a random available stat when prompted. It includes an idle timer to
 * disconnect itself after a period of inactivity to free up server resources.
 * The function is called through clients requesting to play vs a bot through the API.
 *
 * @param PORT The port on which the server is running.
 * @param roomId The ID of the room for the bot to join.
 */
export default async function startBotClient(PORT: string, roomId: number) {
    logger.log(`[BOTCLIENT] Started bot client with room ID: ${roomId}`);

    const socket = connectSocket(PORT, roomId);
    let idleTimer = setIdleTimer(socket);

    socket.on("connect", async () => {
        socket.emit(Events.NAME_ENTER, "MrRobot");
        await delay(500);
        socket.emit(Events.JOIN_ROOM, roomId);
        await delay(1000);
        socket.emit(Events.TOGGLE_READY);
    });

    socket.on(Events.UPDATE, async (viewRoom: ViewRoom) => {
        idleTimer = resetIdleTimer(idleTimer, socket);
        if (!viewRoom || !viewRoom.viewGame) return;

        switch (viewRoom.viewGame.phase) {
            case GamePhases.SELECT_STAT:
                if (!viewRoom.viewGame.opponent.challengeStat) return;
                socket.emit(Events.GAME_COMMAND, {
                    actionType: GameCommands.SELECT_STAT,
                    payload: getRandomAvailableStat(viewRoom.viewGame.lockedStats),
                });
                break;
            case GamePhases.GAME_FINISHED:
                clearTimeout(idleTimer);
                socket.disconnect();
                break;
        }
    });
}

function resetIdleTimer(idleTimer: NodeJS.Timeout, socket: Socket) {
    clearTimeout(idleTimer);
    return setIdleTimer(socket);
}

function setIdleTimer(socket: Socket) {
    return setTimeout(() => {
        socket.emit(Events.LEAVE_ROOM);
        socket.disconnect();
        logger.log("[BOTCLIENT] Idle timeout reached. Disconnecting bot client.");
    }, MAX_IDLE_TIME);
}

function connectSocket(PORT: string, roomId: number) {
    const socket = io(`http://localhost:${PORT}`, {
        auth: {
            uuid: "BOT-" + roomId.toString(),
        },
    });
    socket.on("connect_error", (err: any) => {
        logger.error(`[BOTCLIENT-${roomId}] Connection failed: ${err.message}`);
    });
    return socket;
}

function getRandomAvailableStat(lockedStats: StatNames[]) {
    const allStats = Object.values(StatNames);
    const availableStats = allStats.filter((stat) => !lockedStats.includes(stat));
    const randomIndex = Math.floor(Math.random() * availableStats.length);
    return availableStats[randomIndex];
}
