import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Events, GameCommands, StatNames } from "../../../shared/constants/constants.js";
import { DisplayToStat } from "../constants/constants.js";
import { ViewRoom } from "../../../shared/types/types.js";

/**
 * @file Socket provider (real implementation).
 *
 * Creates and manages the socket connection, exposes `viewRoom` updates and
 * various socket-driven signals and emit helpers to the app.
 */

type SocketContextType = {
    socket: Socket | null;
    viewRoom: ViewRoom | null;
    roomCrashSignal: boolean;
    nameErrorSignal: boolean;
    selectStatErrorSignal: boolean;
    setSelectStatErrorSignal: React.Dispatch<React.SetStateAction<boolean>>;
    setNameErrorSignal: React.Dispatch<React.SetStateAction<boolean>>;
    sendName: (name: string) => void;
    toggleReady: () => void;
    sendSelectStat: (stat: StatNames) => void;
    sendBattleEnd: () => void;
    sendLeaveRoom: () => void;
};

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
    const [viewRoom, setViewRoom] = useState<ViewRoom | null>(null);
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

        socket.on(Events.UPDATE, (viewRoom) => {
            setViewRoom(viewRoom);
        });

        socket.on(Events.ROOM_CRASH, () => {
            setRoomCrashSignal(!roomCrashSignal);
            setTimeout(() => {
                setViewRoom(null);
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

    const toggleReady = () => {
        if (socket) {
            socket.emit(Events.TOGGLE_READY);
        }
    };

    const sendLeaveRoom = () => {
        setViewRoom(null);
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

    const sendBattleEnd = () => {
        if (socket) {
            socket.emit(Events.BATTLE_END, {});
        }
    };

    const value = {
        socket,
        viewRoom,
        roomCrashSignal,
        nameErrorSignal,
        selectStatErrorSignal,
        setSelectStatErrorSignal,
        setNameErrorSignal,
        sendName,
        toggleReady: toggleReady,
        sendSelectStat,
        sendBattleEnd,
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
