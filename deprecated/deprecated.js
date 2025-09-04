// #evaluateBattleOutcome() {
//     let score = 0;
//     const outcomes = [];
//     outcomes.push(
//         this.players[0].pokemon.stats[this.players[0].selectedStat.name] -
//             this.players[1].pokemon.stats[this.players[0].selectedStat.name]
//     );
//     outcomes.push(
//         this.players[0].pokemon.stats[this.players[1].selectedStat.name] -
//             this.players[1].pokemon.stats[this.players[1].selectedStat.name]
//     );

//     outcomes.forEach((outcome) => {
//         if (outcome > 0) {
//             score += 1;
//         } else if (outcome < 0) {
//             score -= 1;
//         }
//     });

//     if (score > 0) {
//         logger.log(
//             `[Game] ${this.players[0].pokemon.name} wins with: ${score}`
//         );
//         this.players[0].addPoint();
//         if (this.#isThereAWinner()) {
//             this.#handleGameEnd();
//         } else {
//             this.#newBattle();
//         }
//     } else if (score < 0) {
//         logger.log(
//             `[Game] ${this.players[1].pokemon.name} wins with: ${-score}`
//         );
//         this.players[1].addPoint();
//         if (this.#isThereAWinner()) {
//             this.#handleGameEnd();
//         } else {
//             this.#newBattle();
//         }
//     } else {
//         logger.log(`[Game] It's a draw`);
//         this.#nextRound();
//     }
//     // reset selected Stats
//     // Change phase to ?
// }
