import { StatNames } from "../../../shared/constants/constants";

export enum Pages {
    HOME = "homePage",
    ENTER_NAME = "enterNamePage",
    ROOM = "roomPage",
    SELECT_STAT = "selectStatPage",
    BATTLE = "battlePage",
    VICTORY = "victoryPage",
    POKEMON_REVEAL = "pokemonRevealPage",
    INSTRUCTIONS = "instructions",
    ROOM_OPTIONS = "roomOptionsPage",
    ENTER_ROOM_ID = "enterRoomIdPage",
}

export const DisplayToStat = new Map([
    ["💖 HP", StatNames.HP],
    ["⚔️ ATTACK", StatNames.ATTACK],
    ["🛡️ DEFENSE", StatNames.DEFENSE],
    ["✨ SP. ATK", StatNames.SPECIAL_ATTACK],
    ["🔷 SP. DEF", StatNames.SPECIAL_DEFENSE],
    ["💨 SPEED", StatNames.SPEED],
    ["⚖️ WEIGHT", StatNames.WEIGHT],
    ["📏 HEIGHT", StatNames.HEIGHT],
]);

export const StatToDisplay = new Map([...DisplayToStat.entries()].map(([key, value]) => [value, key]));
