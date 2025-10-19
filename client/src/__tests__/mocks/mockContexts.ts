import { vi } from "vitest";
import { SocketContextType } from "../../contexts/SocketContext.real";

export const createMockSocketContext = () =>
    ({
        socket: null,
        viewRoom: null,
        hasPassedValidNameCheck: false,
        roomCrashSignal: false,
        nameErrorSignal: false,
        selectStatErrorSignal: false,
        badRoomIdSignal: false,
        setHasPassedValidNameCheck: vi.fn(),
        setSelectStatErrorSignal: vi.fn(),
        setNameErrorSignal: vi.fn(),
        setBadRoomIdSignal: vi.fn(),
        sendName: vi.fn(),
        sendCreateRoom: vi.fn(),
        sendJoinRoom: vi.fn(),
        sendPlayVsBot: vi.fn(),
        toggleReady: vi.fn(),
        sendSelectStat: vi.fn(),
        sendBattleEnd: vi.fn(),
        sendLeaveRoom: vi.fn(),
    } as SocketContextType);

export const createMockUIInfoContext = () => ({
    isWipingIn: false,
    isWipingOut: false,
    setIsWipingIn: vi.fn(),
    setIsWipingOut: vi.fn(),
});
