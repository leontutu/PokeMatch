/**
 * Custom error for failed Assertions.
 * Thrown when an object was attempted to be mapped even though a precondition was not met.
 */
export default class AssertionError extends Error {
    public name: string = "AssertionError";
    /**
     * @param message The error message.
     */
    constructor(message: string) {
        super(message);
    }
}
