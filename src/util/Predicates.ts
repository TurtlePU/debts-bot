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

export function isGroupOffer(
        offer: DataBase.Offer.Document
): offer is DataBase.Offer.Document<DataBase.Offer.Types.Group> {
    return offer.type == 'group'
}
