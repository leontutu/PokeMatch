/**
 * Custom error for failed Mappings.
 * Thrown when an object was attempted to be mapped even though a precondition was not met.
 */
export default class MappingError extends Error {
    public name: string = "MappingError";
    /**
     * @param type The type that failed to map.
     * @param field The field that failed to map.
     */
    constructor(type: string, field: string) {
        super(`Mapping failed for type '${type}' and field '${field}'.`);
    }
}
