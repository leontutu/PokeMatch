import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { GamePhases, Timings } from "../../../shared/constants/constants";
import { Pages } from "../constants/constants";
import { createMockSocketContext } from "../__tests__/mocks/mockContexts";

let { mockSocketContext } = vi.hoisted(() => {
  return {
    mockSocketContext: null as any,
  };
});

let mockSetIsWipingIn: any;
let mockSetIsWipingOut: any;

vi.mock("../contexts/SocketContext", () => ({
  useSocketContext: () => mockSocketContext,
}));

vi.mock("../stores/useUIStore", () => ({
  useUIStore: (selector: (state: any) => any) =>
    selector({
      setIsWipingIn: mockSetIsWipingIn,
      setIsWipingOut: mockSetIsWipingOut,
    }),
}));

const mockPlaySfx = vi.fn();

vi.mock("../stores/useAudioStore", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../stores/useAudioStore")>();
  return {
    ...actual,
    useAudioStore: (selector: (state: any) => any) =>
      selector({
        playSfx: mockPlaySfx,
      }),
  };
});

import { useNavigate } from "./useNavigate";

describe("useNavigate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockSocketContext = createMockSocketContext();
    mockSetIsWipingIn = vi.fn();
    mockSetIsWipingOut = vi.fn();
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
    expect(mockSetIsWipingOut).not.toHaveBeenCalled();
  });

  test("handleNavigate with transition triggers wipe animations, plays sound", async () => {
    const { result } = renderHook(() => useNavigate());

    act(() => {
      result.current.handleNavigate(Pages.ENTER_NAME, true);
    });

    expect(mockSetIsWipingOut).toHaveBeenCalledWith(true);

    act(() => {
      vi.advanceTimersByTime(Timings.PAGE_TRANSITION);
    });

    expect(mockSetIsWipingOut).toHaveBeenCalledWith(false);
    expect(mockSetIsWipingIn).toHaveBeenCalledWith(true);

    expect(result.current.currentPage).toBe(Pages.ENTER_NAME);

    act(() => {
      vi.advanceTimersByTime(Timings.PAGE_TRANSITION);
    });

    expect(mockSetIsWipingIn).toHaveBeenCalledWith(false);

    expect(mockPlaySfx).toHaveBeenCalledTimes(2);
  });

  test("does not navigate to same page", () => {
    const { result } = renderHook(() => useNavigate());

    const initialPage = result.current.currentPage;

    act(() => {
      result.current.handleNavigate(Pages.HOME, true);
    });

    expect(result.current.currentPage).toBe(initialPage);
    expect(mockSetIsWipingOut).not.toHaveBeenCalled();
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

    expect(mockSetIsWipingOut).toHaveBeenCalled();

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
