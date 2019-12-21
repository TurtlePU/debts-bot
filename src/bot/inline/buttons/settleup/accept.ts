import { inline_settleup_accept, inline_settleup_currency } from '#/bot/Constants'
import getLocale from '#/locale/Locale'
import { getUserName } from '#/util/StringUtils'
import dataBase from '#/database/DataBase'

const onClick: Enhancer.Inline.OnClick = {
    key: inline_settleup_accept,
    async callback({ inline_message_id, from }) {
        const locale = getLocale(from.language_code)
        const offer = await dataBase.offerPiece.getOffer(inline_message_id)
        if (!offer) {
            const text = locale.offer.expired
            this.editMessageText(text, { inline_message_id })
            return { text }
        } else if (offer.currency != inline_settleup_currency) {
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

export default onClick
