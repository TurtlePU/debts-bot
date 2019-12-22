import debtPiece  from '#/database/models/DebtModel'
import offerPiece from '#/database/models/OfferModel'
import userPiece  from '#/database/models/UserModel'
import getLocale  from '#/locale/Locale'

import {
    inline_settleup_accept
} from '#/bot/Constants'

import {
    getUserName
} from '#/util/StringUtils'

const onClick: Enhancer.Inline.OnClick = {
    key: inline_settleup_accept,
    async callback({ inline_message_id, from }) {
        const locale = getLocale(from.language_code)
        const offer = await offerPiece.getOffer(inline_message_id)
        if (!offer || offer.type != 'settleup') {
            const text = locale.offer.expired
            this.editMessageText(text, { inline_message_id })
            return { text }
        } else if (offer.from_id == from.id) {
            return { text: locale.offer.selfAccept }
        } else {
            const offerFrom = await userPiece.getUser(offer.from_id)
            if (!offerFrom) {
                throw new Error('Bot user not found')
            }
            const text = locale.settleUp(
                offerFrom.name, getUserName(from))
            offer.remove()
            debtPiece.clearDebts(offer.from_id, from.id)
            this.editMessageText(text, { inline_message_id })
            return { text }
        }
    }
}

export default onClick
