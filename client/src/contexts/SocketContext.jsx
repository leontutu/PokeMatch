import {
    useSocket as RealUseSocket,
    SocketProvider as RealSocketProvider,
} from "./SocketContext.real";

import {
    useSocket as MockUseSocket,
    SocketProvider as MockSocketProvider,
} from "./SocketContext.mock";

let SocketProvider = RealSocketProvider;
let useSocket = RealUseSocket;

if (import.meta.env.VITE_USE_MOCKS) {
    SocketProvider = MockSocketProvider;
    useSocket = MockUseSocket;
    console.log("[SocketContext] Using mock socket context");
}

// eslint-disable-next-line react-refresh/only-export-components
export { useSocket, SocketProvider };
