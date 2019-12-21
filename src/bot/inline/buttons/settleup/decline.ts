import offerPiece from '#/database/models/OfferModel'
import getLocale  from '#/locale/Locale'

import {
    inline_settleup_decline
} from '#/bot/Constants'

import {
    getUserName
} from '#/util/StringUtils'

const onClick: Enhancer.Inline.OnClick = {
    key: inline_settleup_decline,
    callback({ inline_message_id, from }) {
        offerPiece.deleteOffer(inline_message_id)
        return { text: getLocale(from.language_code).offer.declined(getUserName(from)) }
    }
}

export default onClick
