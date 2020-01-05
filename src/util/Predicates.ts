/**
 * Tests if object is not undefined or null
 * @param obj object to test
 */
export function isDefined<T>(obj: T | null | undefined): obj is T {
    return obj !== null && obj !== undefined
}

/**
 * Tests if chat is a group
 * @param chat chat to test
 */
export function isGroup(chat: import('node-telegram-bot-api').Chat): boolean {
    return chat.type == 'group' || chat.type == 'supergroup'
}

/**
 * Checks if offer has given type
 */
export function checkOfferType<T extends keyof DataBase.Offer.Typenames>(
        type: T,
        offer: DataBase.Offer.Document | undefined | null
): offer is DataBase.Offer.Documents[T] {
    return offer?.type == type
}

export function isUnmodifiedMessageError(error: Error) {
    return error.message.includes('message is not modified')
}
