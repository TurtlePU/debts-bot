import debtPiece  from '#/database/models/DebtModel'
import offerPiece from '#/database/models/OfferModel'
import userPiece  from '#/database/models/UserModel'
import getLocale  from '#/locale/Locale'

import {
    inline_debt_accept
} from '#/bot/Constants'

import {
    isDebtOffer
} from '#/util/Predicates'

import {
    getUserName
} from '#/util/StringUtils'

const onClick: Enhancer.Inline.OnClick = {
    key: inline_debt_accept,
    async callback({ inline_message_id, from }) {
        const locale = getLocale(from.language_code)
        const offer = await offerPiece.getOffer(inline_message_id)
        if (!offer || !isDebtOffer(offer)) {
            this.editMessageText(locale.offer.expired, { inline_message_id })
            return { text: locale.offer.expired }
        } else if (from.id == offer.from_id) {
            return { text: locale.offer.selfAccept }
        } else {
            offer.remove()
            debtPiece.saveDebt({
                from: offer.from_id,
                to: from.id,
                amount: offer.debt.amount,
                currency: offer.debt.currency
            })
            const offerFrom = await userPiece.getUser(offer.from_id)
            if (!offerFrom) {
                throw new Error('Bot user not found')
            }
            const text = locale.offer.saved(
                offerFrom.name, getUserName(from),
                offer.debt.amount, offer.debt.currency)
            this.editMessageText(text, { inline_message_id })
            return { text }
        }
    }
}

export default onClick
