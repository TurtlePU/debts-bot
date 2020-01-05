import offerPiece from '#/database/models/Offer'

import { inline_debt_regexp } from '#/bot/Constants'

import { inlineOfferId } from '#/helpers/IdGenerator'

import { log } from '#/util/Log'

/**
 * Saves chosen debt offer to Offer model
 */
const consumer: Enhancer.Inline.ChoiceConsumer = {
    key: inline_debt_regexp,
    callback({ inline_message_id, from }, match) {
        if (!inline_message_id) {
            throw new Error('Inline message id is missing')
        }
        offerPiece.createOffer('debt', {
            id: inlineOfferId(inline_message_id),
            from_id: from.id,
            debt: {
                amount: +match[1],
                currency: match[2]
            }
        }).catch(log)
    }
}

export default consumer
