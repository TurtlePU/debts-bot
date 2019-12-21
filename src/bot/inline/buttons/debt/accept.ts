import { inline_debt_accept } from '#/bot/Constants'
import getLocale from '#/locale/Locale'
import { getUserName } from '#/util/StringUtils'
import dataBase from '#/database/DataBase'

const onClick: Enhancer.Inline.OnClick = {
    key: inline_debt_accept,
    async callback({ inline_message_id, from }) {
        const locale = getLocale(from.language_code)
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

export default onClick
