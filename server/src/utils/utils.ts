/**
 * Returns a promise that resolves after a specified number of milliseconds.
 * @param ms - The delay duration in milliseconds.
 * @returns Promise that resolves after the delay.
 */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function assertIsDefined<T>(
    value: T | null | undefined,
    message: string
): asserts value is T {
    if (value === null || value === undefined) {
        throw new Error(message); //TODO: Implement custom error/exception
    }
}
