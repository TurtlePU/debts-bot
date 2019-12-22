import offerPiece from '#/database/models/OfferModel'
import getLocale  from '#/locale/Locale'

import {
    getUserName
} from './StringUtils'

export function noUserResponse(this: Enhancer.TelegramBot, msg: Enhancer.Message) {
    return this.sendMessage(msg.chat.id, getLocale().anon)
}

export function declineOffer(
        this: Enhancer.TelegramBot, { inline_message_id, from }: Enhancer.Inline.Click) {
    offerPiece.deleteOffer(inline_message_id)
    const text = getLocale(from.language_code).offer.declined(getUserName(from))
    this.editMessageText(text, { inline_message_id })
    return { text }
}
