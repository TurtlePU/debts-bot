import getLocale from '#/locale/Locale'

import {
    inline_debt_accept,
    inline_debt_decline,
    inline_debt_regexp
} from '#/bot/Constants'

const parser: Enhancer.Inline.Command = {
    key: inline_debt_regexp,
    callback(query, match) {
        const locale = getLocale(query.from.language_code)
        const amount = +match[1]
        const currency = match[2] || locale.currency
        return [ amount, -amount ].map(amnt => {
            const article = locale.offerArticle(amnt, currency)
            return {
                id: amnt + currency,
                type: 'article',
                title: article.title,
                input_message_content: {
                    message_text: article.text,
                    parse_mode: 'Markdown'
                },
                reply_markup: {
                    inline_keyboard: [ [
                        { text: locale.buttons.accept, callback_data: inline_debt_accept },
                        { text: locale.buttons.reject, callback_data: inline_debt_decline }
                    ] ]
                }
            }
        })
    }
}

export default parser
