/**
 * Returns a promise that resolves after a specified number of milliseconds.
 * @param {number} ms - The delay duration in milliseconds.
 * @returns {Promise<void>} Promise that resolves after the delay.
 */
export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
