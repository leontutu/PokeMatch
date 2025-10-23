import { GamePhases, StatNames } from "../../../../shared/constants/constants";
import { PlayerInGameId, Pokemon, ViewGame, ViewPlayer, ViewRoom } from "../../../../shared/types/types";

export function createMockViewRoom() {
    return {
        id: 1,
        viewClientRecords: [
            { clientName: "Jessie", isReady: false },
            { clientName: "James", isReady: false },
        ],
        viewGame: createMockViewGame(),
    } as ViewRoom;
}

export function createMockViewGame() {
    const mockviewGame = {
        phase: GamePhases.SELECT_STAT,
        winner: null,
        firstMove: 1 as PlayerInGameId,
        currentRound: 1,
        lockedStats: [StatNames.WEIGHT, StatNames.HEIGHT],
        you: createMockViewPlayer("Jessie", 1),
        opponent: createMockViewPlayer("James", 2),
    } as ViewGame;
    mockviewGame.opponent.pokemon.name = "charmander";
    mockviewGame.opponent.pokemon.stats.attack = 999;
    mockviewGame.opponent.pokemon.stats.defense = 0;
    mockviewGame.opponent.pokemon.sprites.officialArtwork = "charmanderUrl";
    return mockviewGame;
}

export function createMockViewPlayer(name: string = "Jessie", inGameId: PlayerInGameId = 1) {
    return {
        inGameId,
        name,
        points: 10,
        challengeStat: null,
        challengedStat: null,
        pokemon: createMockPokemon(),
    } as ViewPlayer;
}

export function createMockPokemon(overrides = {}): Pokemon {
    return {
        id: 1,
        name: "bulbasaur",
        types: ["grass", "poison"],
        sprites: {
            back_default: "url",
            officialArtwork: "url",
        },
        stats: {
            hp: 45,
            attack: 49,
            defense: 49,
            specialAttack: 65,
            specialDefense: 65,
            speed: 45,
            height: 7,
            weight: 69,
        },
        ...overrides,
    } as Pokemon;
}
