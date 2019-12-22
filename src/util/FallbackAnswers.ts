import offerPiece from '#/database/models/OfferModel'
import userPiece  from '#/database/models/UserModel'
import getLocale  from '#/locale/Locale'

import log from './Log'

import {
    getUserName
} from './StringUtils'

export function noUserResponse(this: Enhancer.TelegramBot, msg: Enhancer.Message) {
    return this.sendMessage(msg.chat.id, getLocale().anon).catch(log)
}

export function declineOffer(
        this: Enhancer.TelegramBot, { inline_message_id, from }: Enhancer.Inline.Click) {
    offerPiece.deleteOffer(inline_message_id).catch(log)
    const text = getLocale(from.language_code).offer.declined(getUserName(from))
    this.editMessageText(text, { inline_message_id }).catch(log)
    return { text }
}

export function acceptOffer<T extends DataBase.Offer.Doc>(
        checker: (offer: DataBase.Offer.Doc) => offer is T,
        getText: (
            locale: Locale, offer: T, offerFrom: DataBase.User, from: Enhancer.User) => string,
        act: (offer: T, from: Enhancer.User) => any) {
    return async function(
        this: Enhancer.TelegramBot, { inline_message_id, from }: Enhancer.Inline.Click
    ) {
        const locale = getLocale(from.language_code)
        const offer = await offerPiece.getOffer(inline_message_id)
        if (!offer || !checker(offer)) {
            const text = locale.offer.expired
            this.editMessageText(text, { inline_message_id }).catch(log)
            return { text }
        } else if (offer.from_id == from.id) {
            return { text: locale.offer.selfAccept }
        } else {
            const offerFrom = await userPiece.getUser(offer.from_id)
            if (!offerFrom) {
                throw new Error('Bot user not found')
            }
            offer.remove().catch(log)
            act(offer, from)
            const text = getText(locale, offer, offerFrom, from)
            this.editMessageText(text, { inline_message_id }).catch(log)
            return { text }
        }
    }
}
