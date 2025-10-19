import { vi, describe, expect, test, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
    BattlePhase,
    ATTACK_ANIMATION_DURATION,
    FADE_OUT_DURATION,
    SHOW_CURRENT_ROUND_DURATION,
} from "./useBattleSequence";
import { BattleStats } from "../types";
import { createMockPokemon, createMockViewRoom } from "../__tests__/mocks/mockViewRoom";
import { StatNames } from "../../../shared/constants/constants";
import { createMockSocketContext } from "../__tests__/mocks/mockContexts";
import { ViewRoom } from "../../../shared/types/types";

/**
 * TODO: Additional test coverage for useBattleSequence
 * - Animation state changes (pokemonAnimation, isFading)
 * - Point awarding logic (awardTemporaryPoints)
 * - Tie scenarios for both rounds
 *
 * Current coverage focuses on critical path (phase transitions + callbacks).
 * Remaining logic is tightly coupled to UI and better tested via e2e.
 * The juice isn't worth the squeeze here.
 */

let { mockPlay } = vi.hoisted(() => {
    return {
        mockPlay: vi.fn(),
    };
});

vi.mock("../contexts/SocketContext", () => ({
    useSocket: () => createMockSocketContext(),
}));

vi.mock("use-sound", () => ({
    useSound: () => [mockPlay, { sound: null }],
}));

import { useBattleSequence } from "./useBattleSequence";
import { useBattleLogic } from "./useBattleLogic";

describe("useBattleSequence", () => {
    let mockViewRoom: ViewRoom;
    let mockBattleStats: BattleStats;
    let onBattleEnd: any;
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        mockViewRoom = createMockViewRoom();
        mockBattleStats = createMockBattleStats();
        onBattleEnd = vi.fn();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test(`transitions through phases correctly`, () => {
        let isWipingIn = true;

        const { result, rerender } = renderHook(() =>
            useBattleSequence(mockBattleStats, onBattleEnd, isWipingIn)
        );

        expect(result.current.phase).toBe(BattlePhase.WAITING);
        act(() => (isWipingIn = false));
        rerender();
        expect(result.current.phase).toBe(BattlePhase.SHOW_CURRENT_ROUND);

        act(() => vi.advanceTimersByTime(SHOW_CURRENT_ROUND_DURATION));
        rerender();
        expect(result.current.phase).toBe(BattlePhase.COLUMNS_1_START);

        act(() => result.current.setPhase(BattlePhase.COLUMNS_1_END));
        act(() => vi.advanceTimersByTime(FADE_OUT_DURATION + ATTACK_ANIMATION_DURATION));
        rerender();

        expect(result.current.phase).toBe(BattlePhase.COLUMNS_2_START);
        act(() => result.current.setPhase(BattlePhase.COLUMNS_2_END));
        act(() => vi.advanceTimersByTime(FADE_OUT_DURATION + ATTACK_ANIMATION_DURATION));
        rerender();
        expect(result.current.phase).toBe(BattlePhase.FINISHED);

        expect(onBattleEnd).toHaveBeenCalled();
        expect(mockPlay).toHaveBeenCalledTimes(4); // 2 cries + 2 hits
    });

    describe("integration test", () => {
        test("transitions through phases correctly with real BattleStats", () => {
            mockViewRoom.viewGame!.you.challengeStat = { name: StatNames.ATTACK, value: 100 };
            mockViewRoom.viewGame!.you.challengedStat = { name: StatNames.DEFENSE, value: 50 };
            mockViewRoom.viewGame!.opponent.challengeStat = { name: StatNames.DEFENSE, value: 100 };
            mockViewRoom.viewGame!.opponent.challengedStat = { name: StatNames.ATTACK, value: 50 };

            let isWipingIn = true;
            const battleStats = renderHook(() => useBattleLogic(mockViewRoom.viewGame)).result.current!;
            const { result, rerender } = renderHook(() =>
                useBattleSequence(battleStats, onBattleEnd, isWipingIn)
            );

            expect(result.current.phase).toBe(BattlePhase.WAITING);
            expect(result.current.phase).toBe(BattlePhase.WAITING);
            act(() => (isWipingIn = false));
            rerender();
            expect(result.current.phase).toBe(BattlePhase.SHOW_CURRENT_ROUND);

            act(() => vi.advanceTimersByTime(SHOW_CURRENT_ROUND_DURATION));
            rerender();
            expect(result.current.phase).toBe(BattlePhase.COLUMNS_1_START);

            act(() => result.current.setPhase(BattlePhase.COLUMNS_1_END));
            act(() => vi.advanceTimersByTime(FADE_OUT_DURATION + ATTACK_ANIMATION_DURATION));
            rerender();

            expect(result.current.phase).toBe(BattlePhase.COLUMNS_2_START);
            act(() => result.current.setPhase(BattlePhase.COLUMNS_2_END));
            act(() => vi.advanceTimersByTime(FADE_OUT_DURATION + ATTACK_ANIMATION_DURATION));
            rerender();
            expect(result.current.phase).toBe(BattlePhase.FINISHED);

            expect(onBattleEnd).toHaveBeenCalled();
            expect(mockPlay).toHaveBeenCalledTimes(4); // 2 cries + 2 hits
        });
    });
});

function createMockBattleStats() {
    return {
        yourPokemon: createMockPokemon(),
        opponentPokemon: createMockPokemon(),
        yourPokemonImgUrl: "",
        opponentPokemonImgUrl: "",
        yourChallengeStat: { name: StatNames.ATTACK, value: 50 },
        yourChallengedStat: { name: StatNames.DEFENSE, value: 20 },
        opponentChallengeStat: { name: StatNames.DEFENSE, value: 80 },
        opponentChallengedStat: { name: StatNames.ATTACK, value: 40 },
        yourChallengeStatDisplay: undefined,
        yourChallengedStatDisplay: undefined,
        opponentChallengeStatDisplay: undefined,
        opponentChallengedStatDisplay: undefined,
        yourChallengeOutcome: false,
        isYourChallengeTie: false,
        opponentChallengeOutcome: false,
        isOpponentChallengeTie: false,
        isYouFirst: false,
        isChallenge1Win: false,
        isChallenge2Win: false,
        isChallenge1Tie: false,
        isChallenge2Tie: false,
    } as BattleStats;
}
