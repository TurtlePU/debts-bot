export function isDefined<T>(obj: T | null | undefined): obj is T {
    return !!obj
}
