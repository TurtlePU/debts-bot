import offerPiece from '#/database/models/OfferModel'
import getLocale  from '#/locale/Locale'

import {
    inline_debt_decline
} from '#/bot/Constants'

import {
    getUserName
} from '#/util/StringUtils'

const onClick: Enhancer.Inline.OnClick = {
    key: inline_debt_decline,
    callback({ inline_message_id, from }) {
        offerPiece.deleteOffer(inline_message_id)
        const text = getLocale(from.language_code).offer.declined(getUserName(from))
        this.editMessageText(text, { inline_message_id })
        return { text }
    }
}

export default onClick
