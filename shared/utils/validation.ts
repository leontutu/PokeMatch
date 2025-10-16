/**
 * Validates a user's name based on several criteria.
 * - Must be a string.
 * - Must be between 3 and 10 characters long (after trimming whitespace).
 * - Must only contain alphanumeric characters and underscores.
 *
 * @param name The name to validate.
 * @returns True if the name is valid, false otherwise.
 */
export function isValidName(name: string): boolean {
    return (
        typeof name === "string" &&
        name.trim().length >= 3 &&
        /^[a-zA-Z0-9_]+$/.test(name) &&
        name.length <= 10
    );
}

/**
 * Validates a room ID based on several criteria.
 * - Must be a string that can be converted to a positive integer.
 * - Must be greater than 0.
 *
 * @param roomId The room ID to validate.
 * @returns True if the room ID is valid, false otherwise.
 */
export function isValidRoomId(roomId: string): boolean {
    const roomIdNumber = parseInt(roomId);
    return !isNaN(roomIdNumber) && roomIdNumber > 0;
}
