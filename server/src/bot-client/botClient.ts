import { io } from "socket.io-client";
import { Events, GameCommands, GamePhases, StatNames } from "../../../shared/constants/constants.js";
import { delay } from "../utils/utils.js";
import { ViewRoom } from "../../../shared/types/types.js";

export default async function startBotClient(roomId: number) {
    console.log("[BOTCLIENT] Started bot client with room ID:", roomId);

    const socket = connectSocket(roomId);
    if (!socket) return;

    socket.emit(Events.NAME_ENTER, "MrRobot");
    await delay(500);
    socket.emit(Events.TOGGLE_READY);

    socket.on(Events.UPDATE, async (viewRoom: ViewRoom) => {
        if (!viewRoom || !viewRoom.viewGame) return;

        switch (viewRoom.viewGame.phase) {
            case GamePhases.SELECT_STAT:
                if (!viewRoom.viewGame.opponent.challengeStat) return;
                socket.emit(Events.GAME_COMMAND, {
                    actionType: GameCommands.SELECT_STAT,
                    payload: getRandomAvailableStat(viewRoom.viewGame.lockedStats),
                });
                break;
        }
    });
}

function connectSocket(roomId: number) {
    const socket = io("http://localhost:3001", {
        auth: {
            uuid: "BOT-" + roomId.toString(),
        },
    });
    socket.on("connect_error", (err: any) => {
        console.error(`[BOTCLIENT-${roomId}] Connection failed:`, err.message);
    });
    return socket;
}

function getRandomAvailableStat(lockedStats: StatNames[]) {
    const allStats = Object.values(StatNames);
    const availableStats = allStats.filter((stat) => !lockedStats.includes(stat));
    const randomIndex = Math.floor(Math.random() * availableStats.length);
    return availableStats[randomIndex];
}

// const socket = import.meta.env.DEV
//     ? io("http://localhost:3001", {
//           auth: {
//               uuid: getOrCreateUUID(),
//           },
//       })
//     : io({
//           auth: {
//           uuid: getOrCreateUUID(),
//       },
//   });
