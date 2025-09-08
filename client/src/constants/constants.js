export const PAGES = {
    HOME: "homePage",
    POKEVIEWER: "pokeViewerPage",
    ENTER_NAME: "enterNamePage",
    ROOM: "roomPage",
    MATCH_LAYOUT: "matchLayout",
    SELECT_STAT: "selectStatPage",
    BATTLE: "battlePage",
    VICTORY: "victoryPage",
};

export const DISPLAY_TO_STAT = new Map([
    ["💖 HP", "hp"],
    ["⚔️ ATTACK", "attack"],
    ["🛡️ DEFENSE", "defense"],
    ["✨ SP. ATK", "specialAttack"],
    ["🔷 SP. DEF", "specialDefense"],
    ["💨 SPEED", "speed"],
    ["⚖️ WEIGHT", "weight"],
    ["📏 HEIGHT", "height"],
]);

export const STAT_TO_DISPLAY = new Map(
    [...DISPLAY_TO_STAT.entries()].map(([key, value]) => [value, key])
);
