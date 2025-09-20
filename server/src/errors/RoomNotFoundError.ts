/**
 * Custom error for operations on non-existent rooms.
 * Thrown when an attempt is made to access a room that cannot be found.
 */
export default class RoomNotFoundError extends Error {
    public name: string = "RoomNotFoundError";
    /**
     * @param roomId The ID of the room that was not found.
     */
    constructor(roomId: number) {
        super(`Room with ID '${roomId}' does not exist.`);
    }
}
