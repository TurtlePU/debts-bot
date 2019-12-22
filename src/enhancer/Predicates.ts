/**
 * Checks if `value` matches the `matcher`
 * @param matcher usually, a key of some listener
 * @param value usually, a Telegram id or data
 */
export function matches(matcher: string | RegExp, value: string) {
    if (typeof matcher == 'string') {
        return matcher == value
    } else {
        return matcher.test(value)
    }
}

/**
 * Checks if listener is identifiable by string key
 * @param callback listener to check
 */
export function isStrict(
        callback: Enhancer.UniqueCallback<any, any, any>
): callback is Enhancer.Inline.Strict<any, any> {
    return typeof callback.key == 'string'
}

/**
 * Checks if given callback query can be called a Click Event
 * @param query callback query
 */
export function isClickEvent(
        query: import('node-telegram-bot-api').CallbackQuery
): query is Enhancer.ClickEvent | Enhancer.Inline.Click {
    return !!query.data
}

/**
 * Checks if given Click Event is not from button below inline message
 * @param click Click Event itself
 */
export function isSimpleClick(click: Enhancer.ClickEventBase): click is Enhancer.ClickEvent {
    return !!click.message
}
