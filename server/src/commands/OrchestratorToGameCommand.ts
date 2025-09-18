import { GAME_COMMANDS } from "../../../shared/constants/constants.js";

/**
 * Represents a command sent from the Orchestrator to a Game instance.
 * This class standardizes the data structure for all actions that modify the game state.
 * Commands can then be uniformly forwarded through RoomManager->Room->Game
 */
export default class OrchestratorToGameCommand {
    /**
     * @param actionType The type of command to execute (from GAME_COMMANDS).
     * @param payload The data required for the command.
     * @param clientId The UUID of the client who initiated the action.
     */
    constructor(
        public actionType: GAME_COMMANDS,
        public payload: any, //TODO: ponder object payload types
        public clientId: string | null
    ) {}

    /**
     * Creates a command that originates from a specific client.
     * @param actionType
     * @param payload
     * @param clientId
     */
    static fromClient(
        actionType: GAME_COMMANDS,
        payload: object,
        clientId: string
    ) {
        return new OrchestratorToGameCommand(actionType, payload, clientId);
    }

    /**
     * Creates a command that is initiated by the system/server.
     * @param actionType
     * @param payload
     */
    static fromSystem(
        actionType: GAME_COMMANDS,
        payload: object | null = null
    ) {
        return new OrchestratorToGameCommand(actionType, payload, null);
    }
}
