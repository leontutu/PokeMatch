import { GameCommands, GamePhases, StatNames } from "../../../shared/constants/constants.js";
import { test, expect, describe, beforeEach } from "vitest";
import { GameEvents } from "../constants/constants.js";
import { createMockPokemon } from "../__test__/mockPokemon.js";
import OrchestratorToGameCommand from "../commands/OrchestratorToGameCommand.js";
import Game from "./Game.js";

describe("Game", () => {
    let game: Game;
    let emittedEvent = undefined as any;
    const participants = [
        { name: "Alice", uuid: "uuid1" },
        { name: "Bob", uuid: "uuid2" },
    ];

    beforeEach(() => {
        game = new Game(participants);
        game.once("gameEvent", (command) => {
            emittedEvent = command;
        });
    });

    describe("constructor", () => {
        test("initializes with correct participants", () => {
            expect(game).toBeDefined();
            expect(game.participants).toEqual(participants);
        });

        test("starts in SELECT_STAT phase", () => {
            expect(game.phase).toBe(GamePhases.SELECT_STAT);
        });
    });

    describe("executeGameCommand", () => {
        describe("#handleAssignNewPokemon", () => {
            test("assigns pokemon and switches phase", () => {
                const pokemon1 = createMockPokemon();
                const pokemon2 = createMockPokemon({ id: 2 });
                const command = new OrchestratorToGameCommand(
                    GameCommands.ASSIGN_NEW_POKEMON,
                    [pokemon1, pokemon2],
                    null
                );
                game.executeGameCommand(command);
                expect(game.players[0].pokemon).toBe(pokemon1);
                expect(game.players[1].pokemon).toBe(pokemon2);
                expect(game.phase).toBe(GamePhases.POKEMON_REVEAL);
            });
        });

        describe("#handleSelectStat", () => {
            test("assigns stat correctly", () => {
                game.players[0].pokemon = createMockPokemon();
                const command = OrchestratorToGameCommand.fromClient(
                    GameCommands.SELECT_STAT,
                    StatNames.ATTACK as any,
                    "uuid1"
                );
                game.executeGameCommand(command);
                expect(game.players[0].selectedStat?.name).toBe(StatNames.ATTACK);
                expect(game.players[0].selectedStat?.value).toBe(49);
            });

            test("rejects locked stat", () => {
                game.players[0].pokemon = createMockPokemon();
                game.lockedStats.push(StatNames.ATTACK);
                const command = OrchestratorToGameCommand.fromClient(
                    GameCommands.SELECT_STAT,
                    StatNames.ATTACK as any,
                    "uuid1"
                );

                game.executeGameCommand(command);
                expect(game.players[0].selectedStat).toBeNull();

                expect(emittedEvent).toBeDefined();
                expect(emittedEvent.eventType).toBe(GameEvents.INVALID_STAT_SELECT);
            });

            test("advances phase if all players selected a stat", () => {
                game.players[0].pokemon = createMockPokemon();
                game.players[1].selectedStat = { name: StatNames.ATTACK, value: 49 };
                const command = OrchestratorToGameCommand.fromClient(
                    GameCommands.SELECT_STAT,
                    StatNames.ATTACK as any,
                    "uuid1"
                );
                game.executeGameCommand(command);
                expect(game.phase).toBe(GamePhases.BATTLE);
                expect(emittedEvent).toBeDefined();
                expect(emittedEvent.eventType).toBe(GameEvents.ALL_SELECTED);
            });
        });

        describe("#handleBattleEnd", () => {
            const command = new OrchestratorToGameCommand(GameCommands.BATTLE_END, {}, null);
            beforeEach(() => {
                game.players[0].pokemon = createMockPokemon();
                game.players[1].pokemon = createMockPokemon();
                game.phase = GamePhases.BATTLE;
                game.firstMove = 1;
                game.players[0].selectedStat = { name: StatNames.ATTACK, value: 100 };
                game.players[1].selectedStat = { name: StatNames.DEFENSE, value: 10 };
            });

            test("transitions phase from BATTLE to SELECT_STAT if round < 3", () => {
                game.currentRound = 1;
                game.executeGameCommand(command);
                expect(game.phase).toBe(GamePhases.SELECT_STAT);
            });

            test("resets currentRound, stats, and emits GAME_FINISHED if round == 3", () => {
                game.lockedStats = [StatNames.ATTACK, StatNames.DEFENSE];
                game.currentRound = 3;
                game.executeGameCommand(command);
                expect(game.currentRound).toBe(1);
                expect(game.players[0].selectedStat).toBeNull();
                expect(game.players[1].selectedStat).toBeNull();
                expect(game.lockedStats).toEqual([]);
                expect(emittedEvent).toBeDefined();
                expect(emittedEvent.eventType).toBe(GameEvents.NEW_MATCH);
            });

            test("locks stats, increments round, alternates firstMove, advances phase", () => {
                game.executeGameCommand(command);
                expect(game.lockedStats).toContain(StatNames.ATTACK);
                expect(game.lockedStats).toContain(StatNames.DEFENSE);
                expect(game.currentRound).toBe(2);
                expect(game.firstMove).toBe(2);
                expect(game.phase).toBe(GamePhases.SELECT_STAT);
            });

            test("does nothing if phase is not BATTLE", () => {
                game.phase = GamePhases.SELECT_STAT;
                game.executeGameCommand(command);
                expect(game.phase).toBe(GamePhases.SELECT_STAT);
            });

            test("checks for winner correctly", () => {
                game.players[0].points = 19;
                game.executeGameCommand(command);
                expect(game.winner).toBe(game.players[0].name);
                expect(game.phase).toBe(GamePhases.GAME_FINISHED);
                expect(emittedEvent).toBeDefined();
                expect(emittedEvent.eventType).toBe(GameEvents.GAME_FINISHED);
            });

            test("evaluates battle outcome correctly and awards points", () => {
                game.currentRound = 2;
                game.players[0].points = 0;
                game.players[1].points = 0;
                game.executeGameCommand(command);
                expect(game.players[0].points).toBe(4); // 2 wins * round 1
                expect(game.players[1].points).toBe(0);
            });

            test("awards no points on ties", () => {
                game.players[0].selectedStat = { name: StatNames.ATTACK, value: 49 };
                game.players[1].selectedStat = { name: StatNames.ATTACK, value: 49 };
                game.executeGameCommand(command);
                expect(game.players[0].points).toBe(0);
                expect(game.players[1].points).toBe(0);
            });

            test("gracefully handles unexpected errors", () => {
                game.players[0].selectedStat = null;
                game.players[1].selectedStat = { name: StatNames.ATTACK, value: 49 };
                game.executeGameCommand(command);
                expect(game.players[0].points).toBe(0);
                expect(game.players[1].points).toBe(0);
            });
        });
    });
});
