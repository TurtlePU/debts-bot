import getLocale from '#/locale/Locale'

import inlineKeyboard from '#/util/InlineKeyboard'

import {
    inline_debt_accept,
    inline_debt_decline,
    inline_debt_regexp
} from '#/bot/Constants'

/**
 * Prepares debt offer inline articles (2 options)
 */
const parser: Enhancer.Inline.Command = {
    key: inline_debt_regexp,
    callback(query, match) {
        const { articles, buttons, currency } = getLocale(query.from.language_code)
        const amount = +match[1]
        const cncy = match[2] ?? currency
        return [ amount, -amount ].map(amnt => {
            const { title, text: message_text } = articles.offer(amnt, cncy)
            return {
                id: amnt + cncy, type: 'article', title,
                input_message_content: { message_text, parse_mode: 'Markdown' },
                reply_markup: inlineKeyboard([ [
                    [ buttons.accept, inline_debt_accept ],
                    [ buttons.reject, inline_debt_decline ]
                ] ])
            }
        })
    }
}

export default parser
