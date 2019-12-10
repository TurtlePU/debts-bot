import { ACCEPT, DECLINE, regexp } from './constants'

const handler: Inline.OnInline = {
    regexp,
    onInline() {
        return (match, locale) => {
            const amount = +match[1]
            const currency = match[2] || locale.currency
            return [ amount, -amount ].map(amnt => {
                const article = locale.offerArticle(amnt, currency)
                return {
                    id: amnt + currency.substring(0, 1),
                    type: 'article',
                    title: article.title,
                    input_message_content: {
                        message_text: article.text,
                        parse_mode: 'Markdown'
                    },
                    reply_markup: {
                        inline_keyboard: [ [
                            { text: locale.buttons.accept, callback_data: ACCEPT },
                            { text: locale.buttons.reject, callback_data: DECLINE }
                        ] ]
                    }
                }
            })
        }
    }
}

export default handler
