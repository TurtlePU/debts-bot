import offerPiece from '#/database/models/Offer'

import log from '#/util/Log'

import {
    inline_settleup_article_id
} from '#/bot/Constants'

import {
    inlineOfferId
} from '#/helpers/IdGenerator'

/**
 * Saves chosen settle-up offer to Offer model
 */
const consumer: Enhancer.Inline.StrictChoiceConsumer = {
    key: inline_settleup_article_id,
    callback({ inline_message_id, from }) {
        if (!inline_message_id) {
            throw new Error('Inline message id is missing')
        }
        offerPiece.createOffer(inlineOfferId(inline_message_id), {
            from_id: from.id,
            type: 'settleup'
        }).catch(log)
    }
}

export default consumer
