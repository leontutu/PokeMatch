import { io } from "socket.io-client";
import { Events } from "../../../shared/constants/constants.js";
import { delay } from "../utils/utils.js";

export default async function startBotClient(roomId: number) {
    console.log("[BOTCLIENT] Started bot client with room ID:", roomId);

    const socket = io("http://localhost:3001", {
        auth: {
            uuid: "BOT-" + roomId.toString(),
        },
    });

    socket.on("connect_error", (err: any) => {
        console.error(`[BOTCLIENT-${roomId}] Connection failed:`, err.message);
    });

    if (!socket) return;

    socket.emit(Events.NAME_ENTER, "MrRobot");
    await delay(500);
    socket.emit(Events.TOGGLE_READY);
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
