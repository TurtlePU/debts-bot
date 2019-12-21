import { inline_settleup_article_id, inline_settleup_currency } from '#/bot/Constants'

export default function inlineSettleUpConsumer(
        offerPiece: OfferPiece
): Enhancer.Inline.StrictChoiceConsumer {
    return {
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
}
