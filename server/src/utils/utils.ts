import AssertionError from "../errors/AssertionError.js";

/**
 * Returns a promise that resolves after a specified number of milliseconds.
 * @param ms - The delay duration in milliseconds.
 * @returns Promise that resolves after the delay.
 */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Asserts that a value is defined (not null or undefined).
 * Currently not in use.
 * @param value - The value to check.
 * @param message - The error message to throw if the assertion fails.
 */
export function assertIsDefined<T>(value: T | null | undefined, message: string): asserts value is T {
    if (value === null || value === undefined) {
        throw new AssertionError(message);
    }
}
