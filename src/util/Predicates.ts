export function isDefined<T>(object: T | undefined | null): object is T {
    return !!object
}

export function isInlineKeyboardEvent(
        query: import('node-telegram-bot-api').CallbackQuery): query is Inline.KeyboardEvent {
    return !!query.inline_message_id
}

export function matches(matcher: string | RegExp, value: string) {
    if (typeof matcher == 'string') {
        return matcher == value
    } else {
        return matcher.test(value)
    }
}
