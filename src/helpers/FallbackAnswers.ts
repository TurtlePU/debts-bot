import offerPiece from '#/database/models/Offer'
import userPiece  from '#/database/models/User'

import getLocale from '#/locale/Locale'

import { inlineOfferId } from '#/helpers/IdGenerator'

import { getUserName } from '#/util/StringUtils'

import { log } from '#/util/Log'

/**
 * Callback for 'decline offer' buttons
 * @param clickEvent 'decline offer' button click event
 * @returns a `ClickResult` to respond with
 */
export function declineOffer(
        this: Enhancer.TelegramBot, clickEvent: Enhancer.Inline.Click): Enhancer.ClickResult {
    const { inline_message_id, from } = clickEvent
    offerPiece.deleteOffer(inlineOfferId(inline_message_id)).catch(log)
    const text = getLocale(from.language_code).hybrid.offer.declined(getUserName(from))
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
export function acceptOffer<T extends keyof DataBase.Offer.Typenames>(
        type: T,
        getText: (
            locale: Locale, offer: DataBase.Offer.Documents[T],
            from: DataBase.User, to: Enhancer.User
        ) => string,
        act: (offer: DataBase.Offer.Documents[T], to: Enhancer.User) => any
): Enhancer.Inline.OnClickStrict['callback'] {
    return async function(
        this: Enhancer.TelegramBot, { inline_message_id, from: to }: Enhancer.Inline.Click
    ) {
        const locale = getLocale(to.language_code)
        const offer = await offerPiece.getOffer(inlineOfferId(inline_message_id))
        if (!checker(type, offer)) {
            const text = locale.hybrid.offer.expired
            this.editMessageText(text, { inline_message_id }).catch(log)
            return { text }
        } else if (offer.from_id == to.id) {
            return { text: locale.response.selfAccept }
        } else {
            const from = await userPiece.getUser(offer.from_id)
            if (!from) {
                throw new Error('Offerer not found')
            }
            (offer as DataBase.Offer.Document).remove().catch(log)
            act(offer, to)
            const text = getText(locale, offer, from, to)
            this.editMessageText(text, { inline_message_id }).catch(log)
            return { text }
        }
    }
}

function checker<T extends keyof DataBase.Offer.Typenames>(
        type: T, offer: DataBase.Offer.Document | null
): offer is DataBase.Offer.Documents[T] {
    return offer?.type == type
}