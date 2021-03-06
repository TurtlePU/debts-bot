const control_symbols = /[*_`]/gu

/**
 * Prepends unintended markdown control symbols with single inverse slash
 * @param str source string
 * @returns resulting string
 */
export function shieldMarkdown(str: string) {
    return str.replace(control_symbols, '\\$&')
}

/**
 * @param user Telegram user whose name we should get
 * @returns name of user which is used for this bot
 */
export function getUserName(user: Enhancer.User) {
    const { first_name, last_name, username } = user
    if (username) {
        return '@' + username
    } else if (last_name) {
        return first_name + ' ' + last_name
    } else {
        return first_name
    }
}
