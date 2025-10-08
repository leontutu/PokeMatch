import { io } from "socket.io-client";

export default function startBotClient(roomId: number) {
    console.log("[BOTCLIENT] Started bot client with room ID:", roomId);

    const socket = io("http://localhost:3001", {
        auth: {
            uuid: "BOT-" + roomId.toString(),
        },
    });

    socket.on("connect_error", (err: any) => {
        console.error("Connection failed:", err.message);
    });
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
