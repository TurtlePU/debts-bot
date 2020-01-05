import { isUnmodifiedMessageError } from './Predicates'

export function catchUnmodified<EType extends Error, RType>(error: EType, result: RType): RType {
    if (!isUnmodifiedMessageError(error)) {
        throw error
    }
    return result
}
