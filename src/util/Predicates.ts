/**
 * Tests if object is not undefined or null
 * @param obj object to test
 */
export function isDefined<T>(obj: T | null | undefined): obj is T {
    return obj !== null && obj !== undefined
}
