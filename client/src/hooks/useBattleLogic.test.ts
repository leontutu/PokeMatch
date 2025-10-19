import { describe, test, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { StatNames } from "../../../shared/constants/constants";
import { createMockViewGame } from "../__tests__/mocks/mockViewRoom";
import { useBattleLogic } from "./useBattleLogic";
import { ViewGame } from "../../../shared/types/types";

describe("useBattleLogic", () => {
    let viewGameMock: ViewGame;
    beforeEach(() => {
        viewGameMock = createMockViewGame();
    });

    test("computes battle stats correctly when stats are selected", () => {
        viewGameMock.you.challengeStat = { name: StatNames.ATTACK, value: 100 };
        viewGameMock.you.challengedStat = { name: StatNames.DEFENSE, value: 50 };
        viewGameMock.opponent.challengeStat = { name: StatNames.DEFENSE, value: 100 };
        viewGameMock.opponent.challengedStat = { name: StatNames.ATTACK, value: 50 };

        const { result } = renderHook(() => useBattleLogic(viewGameMock));

        const battleStats = result.current!;

        expect(battleStats.isYouFirst).toBe(viewGameMock.firstMove === viewGameMock.you.inGameId);

        expect(battleStats.yourPokemon.name).toBe("bulbasaur");
        expect(battleStats.opponentPokemon.name).toBe("charmander");
        expect(battleStats.yourChallengeStat.value).toBe(100);
        expect(battleStats.yourChallengedStat.value).toBe(50);
        expect(battleStats.opponentChallengeStat.value).toBe(100);
        expect(battleStats.opponentChallengedStat.value).toBe(50);
        expect(battleStats.yourChallengeStat.name).toBe(StatNames.ATTACK);
        expect(battleStats.yourChallengedStat.name).toBe(StatNames.DEFENSE);
        expect(battleStats.opponentChallengeStat.name).toBe(StatNames.DEFENSE);
        expect(battleStats.opponentChallengedStat.name).toBe(StatNames.ATTACK);
        expect(battleStats.isChallenge1Win).toBe(true);
        expect(battleStats.isChallenge2Win).toBe(false);
        expect(battleStats.isChallenge1Tie).toBe(false);
        expect(battleStats.isChallenge2Tie).toBe(false);
    });

    test("converts weight from hectograms to kilograms", () => {
        viewGameMock.you.challengeStat = { name: StatNames.WEIGHT, value: 500 };
        viewGameMock.you.challengedStat = { name: StatNames.HEIGHT, value: 20 };
        viewGameMock.opponent.challengeStat = { name: StatNames.HEIGHT, value: 100 };
        viewGameMock.opponent.challengedStat = { name: StatNames.WEIGHT, value: 25 };

        const { result } = renderHook(() => useBattleLogic(viewGameMock));

        const battleStats = result.current!;
        expect(battleStats.yourChallengeStat.value).toBe(50); // 500 hg to 50 kg
        expect(battleStats.opponentChallengeStat.value).toBe(100); // no conversion
    });

    test("identifies ties correctly", () => {
        viewGameMock.you.challengeStat = { name: StatNames.ATTACK, value: 100 };
        viewGameMock.you.challengedStat = { name: StatNames.DEFENSE, value: 50 };
        viewGameMock.opponent.challengeStat = { name: StatNames.DEFENSE, value: 100 };
        viewGameMock.opponent.challengedStat = { name: StatNames.ATTACK, value: 100 };

        const { result } = renderHook(() => useBattleLogic(viewGameMock));

        const battleStats = result.current!;
        expect(battleStats.isChallenge1Tie).toBe(true);
        expect(battleStats.isChallenge2Tie).toBe(false);
        expect(battleStats.isChallenge1Win).toBe(false);
        expect(battleStats.isChallenge2Win).toBe(false);
    });

    test("returns null if no stats are selected", () => {
        viewGameMock.you.challengeStat = null;
        viewGameMock.you.challengedStat = null;
        viewGameMock.opponent.challengeStat = null;
        viewGameMock.opponent.challengedStat = null;

        const { result } = renderHook(() => useBattleLogic(viewGameMock));
        expect(result.current).toBeNull();
    });

    test("returns null if viewGame is null", () => {
        const { result } = renderHook(() => useBattleLogic(null));
        expect(result.current).toBeNull();
    });

    test("handles when viewGame is undefined", () => {
        const { result } = renderHook(() => useBattleLogic(undefined));
        expect(result.current).toBeNull();
    });
});
