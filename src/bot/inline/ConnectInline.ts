import Enhancer from '#/bot-kit/Enhancer'

import ConnectButtons from './buttons/ConnectButtons'

import debtCommand from './commands/debt'
import settleUpCommand from './commands/settleup'

import debtChoice from './choices/debt'
import settleUpChoice from './choices/settleup'

export default function(enhancer: Enhancer, database: DataBase) {
    ConnectButtons(enhancer, database)
    enhancer
        .inlineCommand(debtCommand)
        .inlineCommand(settleUpCommand)
        .inlineChoiceConsumer(debtChoice(database.offerPiece))
        .inlineChoiceConsumer(settleUpChoice(database.offerPiece))
}
