/**
 * Returns a promise that resolves after a specified number of milliseconds.
 * @param ms - The delay duration in milliseconds.
 * @returns Promise that resolves after the delay.
 */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
