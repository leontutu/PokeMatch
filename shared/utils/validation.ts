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
