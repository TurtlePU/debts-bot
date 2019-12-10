import { ButtonCallback } from 'bot/inline/inline_handler'

import { getUserName } from '@util'

import { DECLINE } from '../constants'

const button: ButtonCallback = {
    matcher: data => data == DECLINE,
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
