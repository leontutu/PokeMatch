export enum Pages {
    HOME = "homePage",
    POKEVIEWER = "pokeViewerPage",
    ENTER_NAME = "enterNamePage",
    ROOM = "roomPage",
    SELECT_STAT = "selectStatPage",
    BATTLE = "battlePage",
    VICTORY = "victoryPage",
    POKEMON_REVEAL = "pokemonRevealPage",
}

export const DisplayToStat = new Map([
    ["💖 HP", "hp"],
    ["⚔️ ATTACK", "attack"],
    ["🛡️ DEFENSE", "defense"],
    ["✨ SP. ATK", "specialAttack"],
    ["🔷 SP. DEF", "specialDefense"],
    ["💨 SPEED", "speed"],
    ["⚖️ WEIGHT", "weight"],
    ["📏 HEIGHT", "height"],
]);

export const StatToDisplay = new Map(
    [...DisplayToStat.entries()].map(([key, value]) => [value, key])
);
