import offerPiece from '#/database/models/OfferModel'

import {
    inline_settleup_article_id,
    inline_settleup_currency
} from '#/bot/Constants'

const consumer: Enhancer.Inline.StrictChoiceConsumer = {
    key: inline_settleup_article_id,
    callback({ inline_message_id, from }) {
        if (!inline_message_id) {
            throw new Error('Inline message id is missing')
        }
        offerPiece.createOffer(inline_message_id, {
            from_id: from.id,
            amount: 0,
            currency: inline_settleup_currency
        })
    }
}

export default consumer
