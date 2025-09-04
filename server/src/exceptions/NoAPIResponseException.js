/**
 * Custom exception for failed API requests.
 * Thrown when an external API call does not return a successful response.
 */
export default class NoAPIResponseException extends Error {
    /**
     * @param {string} url The URL of the API request that failed.
     */
    constructor(url) {
        super(`API Request with URL '${url}' failed.`);
        this.name = "NoAPIResponseException";
    }
}
