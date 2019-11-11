import { InlineHandler, FeedbackPiece, ButtonPiece } from './inline_handler'

const ACCEPT = 'settleUp.accept'
const DECLINE = 'settleUp.decline'

const handler: InlineHandler & FeedbackPiece & ButtonPiece = {
    regexp: /.*/u,
    onInline() {
        return (_, locale) => {
            return [ {
                id: 'settle-up',
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
    onInlineResult(dataBase) {
        return ({ inline_message_id, from }) => {
            if (!inline_message_id) {
                throw new Error('Settle-up article message_id is missing')
            }
            dataBase.createOffer(inline_message_id, {
                from_id: from.id,
                amount: 0,
                currency: 'settle-up'
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
                        const text = locale.offer.expired
                        this.editMessageText(text, { inline_message_id })
                        return { text }
                    } else if (offer.from_id == from.id) {
                        dataBase.createOffer(inline_message_id, offer)
                        return { text: locale.offer.selfAccept }
                    } else {
                        const text = locale.settleUp(
                            await dataBase.getNameById(offer.from_id), dataBase.getName(from))
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
