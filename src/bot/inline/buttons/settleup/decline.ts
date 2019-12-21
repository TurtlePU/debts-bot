import { inline_settleup_decline } from '#/bot/Constants'
import getLocale from '#/locale/Locale'
import { getUserName } from '#/util/StringUtils'

export default function(offerPiece: OfferPiece): Enhancer.Inline.OnClick {
    return {
        key: inline_settleup_decline,
        callback({ inline_message_id, from }) {
            offerPiece.deleteOffer(inline_message_id)
            return { text: getLocale(from.language_code).offer.declined(getUserName(from)) }
        }
    }
}
