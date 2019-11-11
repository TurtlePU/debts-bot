import { InlineHandler, ButtonPiece, FeedbackPiece } from './inline_handler'

const ACCEPT = 'offer.accept'
const DECLINE = 'offer.decline'

const handler: InlineHandler & ButtonPiece & FeedbackPiece = {
    regexp: /^(-?\d{1,9})\s*([^\s\d])?$/u,
    onInline() {
        return (match, locale) => {
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
                            { text: locale.buttons.accept, callback_data: ACCEPT },
                            { text: locale.buttons.reject, callback_data: DECLINE }
                        ] ]
                    }
                }
            })
        }
    },
    matcher: id => !!idParser(id),
    onInlineResult(dataBase) {
        return result => {
            if (!result.inline_message_id) {
                throw new Error('Inline message id is missing')
            }
            const match = idParser(result.result_id)
            if (!match) {
                throw new Error('Debt article id is in wrong format')
            }
            const amount = +match[1]
            const currency = match[2]
            dataBase.createOffer(result.inline_message_id, {
                from_id: result.from.id,
                amount, currency
            })
        }
    },
    buttons: [
        {
            matcher: data => data == ACCEPT,
            onClick(dataBase) {
                return async ({ inline_message_id, from }, locale) => {
                    const offer = await dataBase.deleteOffer(inline_message_id)
                    if (!offer) {
                        this.editMessageText(locale.offer.expired, { inline_message_id })
                        return { text: locale.offer.expired }
                    } else if (from.id == offer.from_id) {
                        dataBase.createOffer(inline_message_id, offer)
                        return { text: locale.offer.selfAccept }
                    } else {
                        dataBase.createDebt(offer.from_id, from.id, offer.amount, offer.currency)
                        const text = locale.offer.saved(
                            await dataBase.getNameById(offer.from_id), dataBase.getName(from),
                            offer.amount, offer.currency)
                        this.editMessageText(text, { inline_message_id })
                        return { text }
                    }
                }
            }
        },
        {
            matcher: data => data == DECLINE,
            onClick(dataBase) {
                return ({ inline_message_id, from }, locale) => {
                    dataBase.deleteOffer(inline_message_id)
                    const text = locale.offer.declined(dataBase.getName(from))
                    this.editMessageText(text, { inline_message_id })
                    return { text }
                }
            }
        }
    ]
}

export default handler

function idParser(id: string) {
    return /^(-?\d+)([^\d])$/u.exec(id)
}
