import { ARTICLE_ID, CURRENCY } from './constants'

const feedbackPiece: Inline.OnChosenResult = {
    key: ARTICLE_ID,
    onChosenResult({ offerPiece }) {
        return ({ inline_message_id, from }) => {
            if (!inline_message_id) {
                throw new Error('Inline message id is missing')
            }
            offerPiece.createOffer(inline_message_id, {
                from_id: from.id,
                amount: 0,
                currency: CURRENCY
            })
        }
    }
}

export default feedbackPiece
