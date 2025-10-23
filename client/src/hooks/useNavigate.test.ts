import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { GamePhases, Timings } from "../../../shared/constants/constants";
import { Pages } from "../constants/constants";
import { createMockUIInfoContext, createMockSocketContext } from "../__tests__/mocks/mockContexts";

let { mockUIInfoContext, mockSocketContext, mockPlay } = vi.hoisted(() => {
    return {
        mockUIInfoContext: null as any,
        mockSocketContext: null as any,
        mockPlay: vi.fn(),
    };
});

vi.mock("../contexts/UIInfoContext", () => ({
    useUIInfoContext: () => mockUIInfoContext,
}));

vi.mock("../contexts/SocketContext", () => ({
    useSocketContext: () => mockSocketContext,
}));

vi.mock("use-sound", () => ({
    useSound: () => [mockPlay, { sound: null }],
}));

import { useNavigate } from "./useNavigate";

describe("useNavigate", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        mockUIInfoContext = createMockUIInfoContext();
        mockSocketContext = createMockSocketContext();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("initializes with HOME page", () => {
        const { result } = renderHook(() => useNavigate());

        expect(result.current.currentPage).toBe(Pages.HOME);
        expect(typeof result.current.handleNavigate).toBe("function");
    });

    test("handleNavigate changes page without transition", () => {
        const { result } = renderHook(() => useNavigate());

        act(() => {
            result.current.handleNavigate(Pages.ENTER_NAME, false);
        });

        expect(result.current.currentPage).toBe(Pages.ENTER_NAME);
        expect(mockUIInfoContext.setIsWipingOut).not.toHaveBeenCalled();
    });

    test("handleNavigate with transition triggers wipe animations, plays sound", async () => {
        const { result } = renderHook(() => useNavigate());

        act(() => {
            result.current.handleNavigate(Pages.ENTER_NAME, true);
        });

        expect(mockUIInfoContext.setIsWipingOut).toHaveBeenCalledWith(true);

        act(() => {
            vi.advanceTimersByTime(Timings.PAGE_TRANSITION);
        });

        expect(mockUIInfoContext.setIsWipingOut).toHaveBeenCalledWith(false);
        expect(mockUIInfoContext.setIsWipingIn).toHaveBeenCalledWith(true);

        expect(result.current.currentPage).toBe(Pages.ENTER_NAME);

        act(() => {
            vi.advanceTimersByTime(Timings.PAGE_TRANSITION);
        });

        expect(mockUIInfoContext.setIsWipingIn).toHaveBeenCalledWith(false);

        expect(mockPlay).toHaveBeenCalledTimes(2); // once for wipe out, once for wipe in
    });

    test("does not navigate to same page", () => {
        const { result } = renderHook(() => useNavigate());

        const initialPage = result.current.currentPage;

        act(() => {
            result.current.handleNavigate(Pages.HOME, true);
        });

        expect(result.current.currentPage).toBe(initialPage);
        expect(mockUIInfoContext.setIsWipingOut).not.toHaveBeenCalled();
    });

    test("navigates to BATTLE page when game phase changes to BATTLE", () => {
        mockSocketContext.viewRoom = {
            viewGame: {
                phase: GamePhases.SELECT_STAT,
            },
        } as any;

        const { result, rerender } = renderHook(() => useNavigate());

        act(() => {
            mockSocketContext.viewRoom = {
                viewGame: {
                    phase: GamePhases.BATTLE,
                },
            } as any;
            rerender();
        });

        expect(mockUIInfoContext.setIsWipingOut).toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(result.current.currentPage).toBe(Pages.BATTLE);
    });

    test("shows alert and returns to HOME on room crash", () => {
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

        const { result, rerender } = renderHook(() => useNavigate());

        // Simulate room crash
        act(() => {
            mockSocketContext.roomCrashSignal = true;
            rerender();
        });

        expect(result.current.currentPage).toBe(Pages.HOME);
        expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("oopsie"));

        alertSpy.mockRestore();
    });
});
