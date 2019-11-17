import { InlineHandler, FeedbackPiece, ButtonPiece } from './inline_handler'

const ACCEPT = 'settleUp.accept'
const DECLINE = 'settleUp.decline'
const ARTICLE_ID = 'settle-up'
const CURRENCY = 'settle-up'

const handler: InlineHandler & FeedbackPiece & ButtonPiece = {
    regexp: /.*/u,
    onInline() {
        return (_, locale) => {
            return [ {
                id: ARTICLE_ID,
                type: 'article',
                title: locale.settleUpArticle.title,
                input_message_content: {
                    message_text: locale.settleUpArticle.text,
                    parse_mode: 'Markdown'
                },
                reply_markup: {
                    inline_keyboard: [ [ 
                        { text: locale.buttons.accept, callback_data: ACCEPT },
                        { text: locale.buttons.reject, callback_data: DECLINE }
                    ] ]
                }
            } ]
        }
    },
    matcher: id => id == ARTICLE_ID,
    onInlineResult(dataBase) {
        return ({ inline_message_id, from }) => {
            if (!inline_message_id) {
                throw new Error('Inline message id is missing')
            }
            dataBase.createOffer(inline_message_id, {
                from_id: from.id,
                amount: 0,
                currency: CURRENCY
            })
        }
    },
    buttons: [
        {
            matcher: data => data == ACCEPT,
            onClick(dataBase) {
                return async ({ inline_message_id, from }, locale) => {
                    const offer = await dataBase.getOffer(inline_message_id)
                    if (!offer) {
                        const text = locale.offer.expired
                        this.editMessageText(text, { inline_message_id })
                        return { text }
                    } else if (offer.currency != CURRENCY) {
                        throw new Error('Offer under settle-up message id is not settle-up')
                    } else if (offer.from_id == from.id) {
                        return { text: locale.offer.selfAccept }
                    } else {
                        const text = locale.settleUp(
                            await dataBase.getNameById(offer.from_id), dataBase.getName(from))
                        offer.remove()
                        dataBase.clearDebts(offer.from_id, from.id)
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
                    return { text: locale.offer.declined(dataBase.getName(from)) }
                }
            }
        }
    ]
}

export default handler
