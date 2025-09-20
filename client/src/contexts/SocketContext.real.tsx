import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Events, GameCommands, StatNames } from "../../../shared/constants/constants.js";
import { DisplayToStat } from "../constants/constants.js";
import { RoomState } from "../types.js";

type SocketContextType = {
    socket: Socket | null;
    roomState: RoomState | null;
    roomCrashSignal: boolean;
    nameErrorSignal: boolean;
    selectStatErrorSignal: boolean;
    setSelectStatErrorSignal: React.Dispatch<React.SetStateAction<boolean>>;
    setNameErrorSignal: React.Dispatch<React.SetStateAction<boolean>>;
    sendName: (name: string) => void;
    sendReady: () => void;
    sendSelectStat: (stat: StatNames) => void;
    sendLeaveRoom: () => void;
};

// const value = {
//     socket,
//     roomState: roomState,
//     roomCrashSignal,
//     nameErrorSignal,
//     selectStatErrorSignal,
//     setNameErrorSignal,
//     sendName,
//     sendReady,
//     sendSelectStat,
//     sendLeaveRoom,
// };

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === null) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};

type SocketContextProps = {
    children: ReactNode;
};

export const SocketProvider = ({ children }: SocketContextProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [roomState, setRoomState] = useState<RoomState | null>(null);
    const [roomCrashSignal, setRoomCrashSignal] = useState(false);
    const [nameErrorSignal, setNameErrorSignal] = useState(false);
    const [selectStatErrorSignal, setSelectStatErrorSignal] = useState(false);
    useEffect(() => {
        const socket = import.meta.env.DEV
            ? io("http://localhost:3001", {
                  auth: {
                      uuid: getOrCreateUUID(),
                  },
              })
            : io({
                  auth: {
                      uuid: getOrCreateUUID(),
                  },
              });
        setSocket(socket);

        socket.on("connect_error", (err) => {
            console.error("Connection failed:", err.message);
            alert(
                `Connection failed: ${err.message}. Please try reloading the page, or try a different browser or network.`
            );
        });

        socket.on(Events.UPDATE, (data) => {
            setRoomState(data);
        });

        socket.on(Events.ROOM_CRASH, () => {
            setRoomCrashSignal(!roomCrashSignal);
            setTimeout(() => {
                setRoomState(null);
            }, 500);
        });

        socket.on(Events.NAME_ERROR, () => {
            setNameErrorSignal(true);
        });

        socket.on(Events.SELECT_STAT_ERROR, () => {
            setSelectStatErrorSignal(true);
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [roomCrashSignal, nameErrorSignal, selectStatErrorSignal]);

    const sendName = (name: string) => {
        if (socket) {
            socket.emit(Events.NAME_ENTER, name);
        }
    };

    const sendReady = () => {
        if (socket) {
            socket.emit(Events.READY);
        }
    };

    const sendLeaveRoom = () => {
        setRoomState(null);
        if (socket) {
            socket.emit(Events.LEAVE_ROOM);
        }
    };

    const sendSelectStat = (stat: StatNames) => {
        if (socket) {
            const statAsInJson = DisplayToStat.get(stat);
            socket.emit(Events.GAME_COMMAND, {
                actionType: GameCommands.SELECT_STAT,
                payload: statAsInJson,
            });
        }
    };

    const value = {
        socket,
        roomState: roomState,
        roomCrashSignal,
        nameErrorSignal,
        selectStatErrorSignal,
        setSelectStatErrorSignal,
        setNameErrorSignal,
        sendName,
        sendReady,
        sendSelectStat,
        sendLeaveRoom,
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

function getOrCreateUUID() {
    let uuid = localStorage.getItem("userUUID");
    if (!uuid) {
        uuid = crypto.randomUUID();
        localStorage.setItem("userUUID", uuid);
    }
    return uuid;
}
