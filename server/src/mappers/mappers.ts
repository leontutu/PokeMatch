import Player from "../models/Player.js";
import { ViewGame, ViewPlayer, ViewRoom } from "../../../shared/types/types.js";
import MappingError from "../errors/MappingError.js";
import Room from "../models/Room.js";
import Game from "../models/Game.js";
import { StatNames } from "../../../shared/constants/constants.js";

/**
 * Convert domain models (Room, Game, Player) into client view DTOs.
 * Validates required fields and throws MappingError on critical misses.
 */

export function mapRoomToViewRoom(room: Room, uuid: string): ViewRoom {
    return {
        id: room.id,
        viewClientRecords: room.clientRecords.map((clientRecord) => {
            return {
                clientName: clientRecord.client.name,
                isReady: clientRecord.isReady,
            };
        }),
        viewGame: room.game ? mapGameToViewGame(room.game, uuid) : null,
    };
}

function mapGameToViewGame(game: Game, uuid: string): ViewGame {
    const you = game.players[0].uuid === uuid ? game.players[0] : game.players[1];
    const opponent = game.players[0].uuid === uuid ? game.players[1] : game.players[0];
    return {
        phase: game.phase,
        lockedStats: game.lockedStats,
        winner: game.winner ? game.winner : null,
        firstMove: game.firstMove,
        currentRound: game.currentRound,
        you: mapPlayerToViewPlayer(
            you,
            opponent.selectedStat == null ? undefined : opponent.selectedStat!.name
        ),
        opponent: mapPlayerToViewPlayer(
            opponent,
            you.selectedStat == null ? undefined : you.selectedStat!.name
        ),
    };
}

function mapPlayerToViewPlayer(player: Player, challengedStatName?: StatNames): ViewPlayer {
    if (!player.pokemon) {
        throw new MappingError("Player", "pokemon");
    }
    return {
        inGameId: player.inGameId,
        name: player.name,
        points: player.points,
        pokemon: player.pokemon,
        challengeStat: player.selectedStat,
        challengedStat: challengedStatName
            ? { name: challengedStatName, value: player.pokemon.stats[challengedStatName] }
            : null,
    };
}
