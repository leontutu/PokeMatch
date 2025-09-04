import { GAME_PHASES } from "../../../shared/constants";

export const mockRoomState = {
    id: "0",
    clients: [
        { name: "Foo", isReady: true },
        { name: "Bar", isReady: false },
    ],
    game: {
        phase: GAME_PHASES.BATTLE,
        lockedStats: ["speed", "defense"],
        flags: {},
        winner: "Foo",
        you: {
            name: "Foo",
            points: 0,
            challengeStat: { name: "speed", value: 100 },
            challengedStat: { name: "defense", value: 100 },
            pokemon: {
                name: "pikachu",
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
                    speed: 90,
                    height: 4,
                    weight: 3,
                },
            },
        },
        opponent: {
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
