export function shieldMarkdown(str: string) {
    const control_symbols = [ '*', '_', '(', ')', '[', ']', '`' ]
    let result = str
    for (const sym of control_symbols) {
        result = result.replace(sym, '\\' + sym)
    }
    return result
}
