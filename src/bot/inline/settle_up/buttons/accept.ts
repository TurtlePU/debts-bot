import { getUserName } from '#/util/string_utils'

import { ACCEPT, CURRENCY } from '../constants'

const button: Inline.OnClick = {
    key: ACCEPT,
    onClick(dataBase) {
        return async ({ inline_message_id, from }, locale) => {
            const offer = await dataBase.offerPiece.getOffer(inline_message_id)
            if (!offer) {
                const text = locale.offer.expired
                this.editMessageText(text, { inline_message_id })
                return { text }
            } else if (offer.currency != CURRENCY) {
                throw new Error('Offer under settle-up message id is not settle-up')
            } else if (offer.from_id == from.id) {
                return { text: locale.offer.selfAccept }
            } else {
                const offerFrom = await dataBase.userPiece.getUser(offer.from_id)
                if (!offerFrom) {
                    throw new Error('Bot user not found')
                }
                const text = locale.settleUp(
                    offerFrom.name, getUserName(from))
                offer.remove()
                dataBase.debtPiece.clearDebts(offer.from_id, from.id)
                this.editMessageText(text, { inline_message_id })
                return { text }
            }
        }
    }
}

export default button
