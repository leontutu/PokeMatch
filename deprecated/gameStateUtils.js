import { GAME_PHASES } from "../../../shared/constants/constants.js";

export function serverGameStateToClientGameState(room, targetClient) {
    const roomState = room.toJSON();

    if (room.game) {
        let clientGameState = {};
        clientGameState.phase = room.game.phase;
        clientGameState.lockedStats = room.game.lockedStats;
        clientGameState.winner = room.game.winner;

        if (room.clientRecords[0].client == targetClient) {
            clientGameState.you = room.game.players[0].toJSON();
            clientGameState.opponent = room.game.players[1].toJSON();
        } else {
            clientGameState.you = room.game.players[1].toJSON();
            clientGameState.opponent = room.game.players[0].toJSON();
        }

        if (room.game.phase === GAME_PHASES.BATTLE) {
            if (room.clientRecords[0].client == targetClient) {
                clientGameState.you.challengeStat =
                    room.game.players[0].selectedStat;
                let opponentStatName = room.game.players[1].selectedStat.name;
                clientGameState.you.challengedStat = {
                    name: opponentStatName,
                    value: room.game.players[0].pokemon.stats[opponentStatName],
                };
                clientGameState.opponent.challengeStat =
                    room.game.players[1].selectedStat;
                let youStatName = room.game.players[0].selectedStat.name;
                clientGameState.opponent.challengedStat = {
                    name: youStatName,
                    value: room.game.players[1].pokemon.stats[youStatName],
                };
            } else {
                clientGameState.you.challengeStat =
                    room.game.players[1].selectedStat;
                let opponentStatName = room.game.players[0].selectedStat.name;
                clientGameState.you.challengedStat = {
                    name: opponentStatName,
                    value: room.game.players[1].pokemon.stats[opponentStatName],
                };
                clientGameState.opponent.challengeStat =
                    room.game.players[0].selectedStat;
                let youStatName = room.game.players[1].selectedStat.name;
                clientGameState.opponent.challengedStat = {
                    name: youStatName,
                    value: room.game.players[0].pokemon.stats[youStatName],
                };
            }
        }
        roomState.gameState = clientGameState;
    }

    return roomState;
}
