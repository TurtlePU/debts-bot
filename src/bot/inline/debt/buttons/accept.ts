import { ButtonCallback } from '@/bot/inline/inline_handler'

import { getUserName } from '@util'

import { ACCEPT } from '../constants'

const button: ButtonCallback = {
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
}

export default button
