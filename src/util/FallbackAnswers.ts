import offerPiece from '#/database/models/Offer'
import userPiece  from '#/database/models/User'
import getLocale  from '#/locale/Locale'

import log from './Log'

import {
    getUserName
} from './StringUtils'

/**
 * Default reply if `msg.from` field is missing
 * @param msg message to reply to
 */
export function noUserResponse(this: Enhancer.TelegramBot, msg: Enhancer.Message) {
    return this.sendMessage(msg.chat.id, getLocale().anon).catch(log)
}

/**
 * Callback for 'decline offer' buttons
 * @param clickEvent 'decline offer' button click event
 * @returns a `ClickResult` to respond with
 */
export function declineOffer(
        this: Enhancer.TelegramBot, clickEvent: Enhancer.Inline.Click): Enhancer.ClickResult {
    const { inline_message_id, from } = clickEvent
    offerPiece.deleteOffer(inline_message_id).catch(log)
    const text = getLocale(from.language_code).offer.declined(getUserName(from))
    this.editMessageText(text, { inline_message_id }).catch(log)
    return { text }
}

/**
 * Builds a callback for 'accept offer' button
 * @param checker should check that found offer is of correct type
 * @param getText should return text for corresponding type of offer
 * @param act should execute offered action
 * @returns built callback
 */
export function acceptOffer<T extends DataBase.Offer.Document>(
        checker: (offer: DataBase.Offer.Document) => offer is T,
        getText: (locale: Locale, offer: T, from: DataBase.User, to: Enhancer.User) => string,
        act: (offer: T, to: Enhancer.User) => any
): Enhancer.Inline.OnClick['callback'] {
    return async function(
        this: Enhancer.TelegramBot, { inline_message_id, from: to }: Enhancer.Inline.Click
    ) {
        const locale = getLocale(to.language_code)
        const offer = await offerPiece.getOffer(inline_message_id)
        if (!offer || !checker(offer)) {
            const text = locale.offer.expired
            this.editMessageText(text, { inline_message_id }).catch(log)
            return { text }
        } else if (offer.from_id == to.id) {
            return { text: locale.offer.selfAccept }
        } else {
            const from = await userPiece.getUser(offer.from_id)
            if (!from) {
                throw new Error('Offerer not found')
            }
            offer.remove().catch(log)
            act(offer, to)
            const text = getText(locale, offer, from, to)
            this.editMessageText(text, { inline_message_id }).catch(log)
            return { text }
        }
    }
}
