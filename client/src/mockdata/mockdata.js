import { GamePhases } from "../../../shared/constants/constants";

// NOTE: Deprecated. Still usable for quick testing but needs to be updated sooner or later

export const mockRoomState = {
    id: "0",
    viewClientRecords: [
        { client: { name: "Foo" }, isReady: true },
        { client: { name: "Bar" }, isReady: false },
    ],
    viewGame: {
        phase: GamePhases.BATTLE,
        lockedStats: ["speed", "defense"],
        flags: {},
        winner: "Foo",
        firstMove: 1,
        currentRound: 1,
        you: {
            inGameId: 1,
            name: "Foo",
            points: 0,
            challengeStat: { name: "speed", value: 120 },
            challengedStat: { name: "defense", value: 40 },
            pokemon: {
                id: 25,
                name: "Pikachu",
                types: ["electric", "flying"],
                sprites: {
                    back_default:
                        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/150.png",
                    officialArtwork:
                        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
                },
                stats: {
                    hp: 35,
                    attack: 55,
                    defense: 40,
                    specialAttack: 50,
                    specialDefense: 50,
                    speed: 120,
                    height: 4,
                    weight: 3,
                },
            },
        },
        opponent: {
            inGameId: 2,
            name: "Bar",
            points: 0,
            challengeStat: { name: "defense", value: 105 },
            challengedStat: { name: "speed", value: 90 },
            pokemon: {
                name: "kabutops",
                types: ["rock", "water"],
                sprites: {
                    back_default:
                        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/141.png",
                    officialArtwork:
                        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/141.png",
                },
                stats: {
                    hp: 60,
                    attack: 115,
                    defense: 105,
                    specialAttack: 65,
                    specialDefense: 70,
                    speed: 90,
                    height: 113,
                    weight: 405,
                },
            },
        },
    },
};

// export const mockRoomState = {
//     id: "0",
//     clients: [
//         { name: "Foo", isReady: true },
//         { name: "Bar", isReady: false },
//     ],
//     game: null,
// };

// export const mockRoomState = null;
