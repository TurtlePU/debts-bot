import Enhancer from '#/enhancer/Enhancer'

import ConnectButtons from './buttons/ConnectButtons'

import debtCommand from './commands/debt'
import settleUpCommand from './commands/settleup'

import debtChoice from './choices/debt'
import settleUpChoice from './choices/settleup'

export default function(this: Enhancer) {
    this.inlineCommand(debtCommand)
        .inlineCommand(settleUpCommand)
        .inlineChoiceConsumer(debtChoice)
        .inlineChoiceConsumer(settleUpChoice)
        .inject(ConnectButtons)
}
