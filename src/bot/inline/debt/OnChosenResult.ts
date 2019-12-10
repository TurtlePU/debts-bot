import { regexp } from './Constants'

const feedbackPiece: Inline.OnChosenResult = {
    key: regexp,
    onChosenResult({ offerPiece }) {
        return result => {
            if (!result.inline_message_id) {
                throw new Error('Inline message id is missing')
            }
            const match = regexp.exec(result.query)
            if (!match) {
                throw new Error('Debt article id is in wrong format')
            }
            const amount = +match[1]
            const currency = match[2]
            offerPiece.createOffer(result.inline_message_id, {
                from_id: result.from.id,
                amount, currency
            })
        }
    }
}

export default feedbackPiece