export function shieldMarkdown(str: string) {
    const control_symbols = [ '*', '_', '(', ')', '[', ']', '`', '\\' ]
    let result = str
    for (const sym of control_symbols) {
        result = result.replace(sym, '\\' + sym)
    }
    return result
}

export function getUserName({
    first_name, last_name, username }: import('node-telegram-bot-api').User) {
    if (username) {
        return '@' + username
    } else if (last_name) {
        return first_name + ' ' + last_name
    } else {
        return first_name
    }
}
