export function matches(matcher: string | RegExp, value: string) {
    if (typeof matcher == 'string') {
        return matcher == value
    } else {
        return matcher.test(value)
    }
}

export function isStrict(
        callback: Enhancer.UniqueCallback<any, any, any>
): callback is Enhancer.Inline.Strict<any, any> {
    return typeof callback.key == 'string'
}

export function isClickEvent(
        query: import('node-telegram-bot-api').CallbackQuery
): query is Enhancer.ClickEvent | Enhancer.Inline.Click {
    return !!query.data
}

export function isSimpleClick(click: Enhancer.ClickEventBase): click is Enhancer.ClickEvent {
    return !!click.message
}
