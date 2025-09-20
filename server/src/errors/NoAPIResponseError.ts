/**
 * Custom error for failed API requests.
 * Thrown when an external API call does not return a successful response.
 */
export default class NoAPIResponseError extends Error {
    public name: string = "NoAPIResponseError";
    /**
     * @param url The URL of the API request that failed.
     */
    constructor(url: string) {
        super(`API Request with URL '${url}' failed.`);
    }
}
