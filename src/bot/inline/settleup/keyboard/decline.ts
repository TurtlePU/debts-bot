import { getUserName } from '#/util/StringUtils'

import { DECLINE } from '../Constants'

const button: Inline.OnClick = {
    key: DECLINE,
    onClick(dataBase) {
        return ({ inline_message_id, from }, locale) => {
            dataBase.offerPiece.deleteOffer(inline_message_id)
            return { text: locale.offer.declined(getUserName(from)) }
        }
    }
}

export default button
