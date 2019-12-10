import { ButtonCallback } from 'bot/inline/inline_handler'

import { getUserName } from '@util'

import { DECLINE } from '../constants'

const button: ButtonCallback = {
    matcher: data => data == DECLINE,
    onClick(dataBase) {
        return ({ inline_message_id, from }, locale) => {
            dataBase.offerPiece.deleteOffer(inline_message_id)
            return { text: locale.offer.declined(getUserName(from)) }
        }
    }
}

export default button
