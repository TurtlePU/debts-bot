import { InlineHandler, ButtonPiece, FeedbackPiece } from './inline_handler'
import { getUserName } from '@util'

const ACCEPT = 'offer.accept'
const DECLINE = 'offer.decline'
const regexp = /^(-?\d{1,9})\s*([^\s\d].{0,99})?$/u

const handler: InlineHandler & ButtonPiece & FeedbackPiece = {
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
    },
    matcher: id => !!regexp.exec(id),
    onInlineResult({ offerPiece }) {
        return result => {
            if (!result.inline_message_id) {
                throw new Error('Inline message id is missing')
            }
            const match = regexp.exec(result.query)
            if (!match) {
                throw new Error('Debt article id is in wrong format')
            }
            const amount = +match[1]
            const currency = match[2]
            offerPiece.createOffer(result.inline_message_id, {
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
                    const offer = await dataBase.offerPiece.getOffer(inline_message_id)
                    if (!offer) {
                        this.editMessageText(locale.offer.expired, { inline_message_id })
                        return { text: locale.offer.expired }
                    } else if (from.id == offer.from_id) {
                        return { text: locale.offer.selfAccept }
                    } else {
                        offer.remove()
                        dataBase.debtPiece.saveDebt({
                            from: offer.from_id,
                            to: from.id,
                            amount: offer.amount,
                            currency: offer.currency
                        })
                        const offerFrom = await dataBase.userPiece.getUser(offer.from_id)
                        if (!offerFrom) {
                            throw new Error('Bot user not found')
                        }
                        const text = locale.offer.saved(
                            offerFrom.name, getUserName(from),
                            offer.amount, offer.currency)
                        this.editMessageText(text, { inline_message_id })
                        return { text }
                    }
                }
            }
        },
        {
            matcher: data => data == DECLINE,
            onClick({ offerPiece }) {
                return ({ inline_message_id, from }, locale) => {
                    offerPiece.deleteOffer(inline_message_id)
                    const text = locale.offer.declined(getUserName(from))
                    this.editMessageText(text, { inline_message_id })
                    return { text }
                }
            }
        }
    ]
}

export default handler
