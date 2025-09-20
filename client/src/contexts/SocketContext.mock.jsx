import React, { createContext, useContext, useEffect, useState } from "react";
import { Events, GameCommands } from "../../../shared/constants/constants.js";
import { mockRoomState } from "../mockdata/mockdata.js";

/**
 * Mock implementation of the SocketContext for testing purposes
 * NOTE: Will be cleaned up when implementing Unit tests
 */

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [roomState, setRoomState] = useState(mockRoomState);
    const [roomCrashSignal, setRoomCrashSignal] = useState(false);
    const [nameErrorSignal, setNameErrorSignal] = useState(false);

    const sendName = (name) => {
        // socket.emit(EVENTS.NAME_ENTER, name);
    };

    const sendReady = () => {
        // socket.emit(EVENTS.READY);
    };

    const sendSelectStat = (stat) => {
        // socket.emit(EVENTS.GAME_ACTION, {
        // actionType: GAME_ACTIONS.SELECT_STAT,
        // payload: stat,
    };
    // };

    // const sendGameAction = (actionType, payload) => {
    //     if (socket) {
    //         socket.emit(EVENTS.GAME_ACTIONS, { actionType, payload });
    //     }
    // };

    const value = {
        socket,
        roomState: roomState,
        roomCrashSignal,
        nameErrorSignal,
        sendName,
        sendReady,
        sendSelectStat,
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
