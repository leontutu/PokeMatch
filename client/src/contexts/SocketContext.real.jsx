import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { EVENTS, GAME_COMMANDS } from "../../../shared/constants.js";
import { DISPLAY_TO_STAT } from "../constants";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [roomState, setRoomState] = useState(null);
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

        socket.on(EVENTS.UPDATE, (data) => {
            setRoomState(data);
        });

        socket.on(EVENTS.ROOM_CRASH, () => {
            setRoomCrashSignal(!roomCrashSignal);
            setTimeout(() => {
                setRoomState(null);
            }, 500);
        });

        socket.on(EVENTS.NAME_ERROR, () => {
            setNameErrorSignal(true);
        });

        socket.on(EVENTS.SELECT_STAT_ERROR, () => {
            setSelectStatErrorSignal(true);
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [roomCrashSignal, nameErrorSignal, selectStatErrorSignal]);

    const sendName = (name) => {
        if (socket) {
            socket.emit(EVENTS.NAME_ENTER, name);
        }
    };

    const sendReady = () => {
        if (socket) {
            socket.emit(EVENTS.READY);
        }
    };

    const sendLeaveRoom = () => {
        if (socket) {
            socket.emit(EVENTS.LEAVE_ROOM);
            setRoomState(null);
        }
    };

    const sendSelectStat = (stat) => {
        if (socket) {
            const statAsInJson = DISPLAY_TO_STAT.get(stat);
            socket.emit(EVENTS.GAME_COMMAND, {
                actionType: GAME_COMMANDS.SELECT_STAT,
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

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

function getOrCreateUUID() {
    let uuid = localStorage.getItem("userUUID");
    if (!uuid) {
        uuid = crypto.randomUUID();
        localStorage.setItem("userUUID", uuid);
    }
    return uuid;
}
