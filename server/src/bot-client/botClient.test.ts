import { vi, describe, test, expect, beforeEach, type Mock } from "vitest";
import startBotClient from "./botClient.js";
import { io } from "socket.io-client";
import { Events } from "../../../shared/constants/constants.js";

const { mockSocket, ioMock } = vi.hoisted(() => {
    const mockSocket = {
        on: vi.fn(),
        emit: vi.fn(),
        disconnect: vi.fn(),
    };

    return {
        mockSocket,
        ioMock: vi.fn(() => mockSocket),
    };
});

vi.mock("socket.io-client", () => ({
    io: ioMock,
}));

describe("botClient", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("startBotClient", () => {
        test("starts the bot client and connects to the server", () => {
            const ioMock = io as Mock;
            startBotClient("3000", 1);
            expect(ioMock).toHaveBeenCalledWith("http://localhost:3000", expect.any(Object));
        });

        test("registers event handlers on connect", () => {
            startBotClient("3000", 1);

            expect(mockSocket.on).toHaveBeenCalledTimes(3);

            const eventNames = mockSocket.on.mock.calls.map((call) => call[0]);
            expect(eventNames).toContain("connect");
            expect(eventNames).toContain("connect_error");
            expect(eventNames).toContain(Events.UPDATE);
        });

        test("emits events on connect", async () => {
            vi.useFakeTimers();
            startBotClient("3000", 1);

            const connectCall = mockSocket.on.mock.calls.find((call) => call[0] === "connect");
            expect(connectCall).toBeDefined();

            const connectHandler = connectCall![1] as () => Promise<void>;

            const promise = connectHandler();
            await vi.advanceTimersByTimeAsync(1500);
            await promise;

            expect(mockSocket.emit).toHaveBeenCalledTimes(3);

            expect(mockSocket.emit).toHaveBeenCalledWith(Events.NAME_ENTER, "MrRobot");
            expect(mockSocket.emit).toHaveBeenCalledWith(Events.JOIN_ROOM, 1);
            expect(mockSocket.emit).toHaveBeenCalledWith(Events.TOGGLE_READY);
            vi.useRealTimers();
        });

        test("emits events on connect with delays", async () => {
            vi.useFakeTimers();
            startBotClient("3000", 1);
            const connectHandler = mockSocket.on.mock.calls.find(
                (call) => call[0] === "connect"
            )![1] as () => Promise<void>;
            const promise = connectHandler();
            await vi.advanceTimersByTimeAsync(1500);
            await promise;
            expect(mockSocket.emit).toHaveBeenCalledTimes(3);
            expect(mockSocket.emit).toHaveBeenNthCalledWith(1, Events.NAME_ENTER, "MrRobot");
            expect(mockSocket.emit).toHaveBeenNthCalledWith(2, Events.JOIN_ROOM, 1);
            expect(mockSocket.emit).toHaveBeenNthCalledWith(3, Events.TOGGLE_READY);

            vi.useRealTimers();
        });
    });
});
