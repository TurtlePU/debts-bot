import { getUserName } from '#/util/string_utils'

import { DECLINE } from '../constants'

const button: Inline.OnClick = {
    key: DECLINE,
    onClick({ offerPiece }) {
        return ({ inline_message_id, from }, locale) => {
            offerPiece.deleteOffer(inline_message_id)
            const text = locale.offer.declined(getUserName(from))
            this.editMessageText(text, { inline_message_id })
            return { text }
        }
    }
}

export default button
