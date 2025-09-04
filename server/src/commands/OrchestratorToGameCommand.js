/**
 * Represents a command sent from the Orchestrator to a Game instance.
 * This class standardizes the data structure for all actions that modify the game state.
 * Commands can then be uniformly forwarded through RoomManager->Room->Game
 */
export default class OrchestratorToGameCommand {
    /**
     * @param {string} actionType The type of command to execute (from GAME_COMMANDS).
     * @param {*} payload The data required for the command.
     * @param {string|null} clientId The UUID of the client who initiated the action.
     */
    constructor(actionType, payload, clientId = null) {
        this.actionType = actionType;
        this.payload = payload;
        this.clientId = clientId;
    }
}
