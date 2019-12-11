export function isDefined<T>(object: T | undefined | null): object is T {
    return !!object
}

export function isInlineKeyboardEvent(
        query: import('node-telegram-bot-api').CallbackQuery): query is Inline.KeyboardEvent {
    return !!query.inline_message_id
}
