import Enhancer from '#/enhancer/Enhancer'

import ConnectButtons from './buttons/ConnectButtons'

import debtChoice  from './choices/debt'
import debtCommand from './commands/debt'

import settleUpChoice  from './choices/settleup'
import settleUpCommand from './commands/settleup'

export default function(this: Enhancer) {
    this.inlineCommand(debtCommand)
        .inlineCommand(settleUpCommand)
        .inlineChoiceConsumer(debtChoice)
        .inlineChoiceConsumer(settleUpChoice)
        .inject(ConnectButtons)
}
