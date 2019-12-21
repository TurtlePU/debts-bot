import { inline_debt_regexp } from '#/bot/Constants'
import dataBase from '#/database/DataBase'

const consumer: Enhancer.Inline.ChoiceConsumer = {
    key: inline_debt_regexp,
    callback(result, match) {
        if (!result.inline_message_id) {
            throw new Error('Inline message id is missing')
        }
        const amount = +match[1]
        const currency = match[2]
        dataBase.offerPiece.createOffer(result.inline_message_id, {
            from_id: result.from.id,
            amount, currency
        })
    }
}

export default consumer
