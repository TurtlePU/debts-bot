import Enhancer from '#/bot-kit/Enhancer'

import debtAccept from './debt/accept'
import debtDecline from './debt/decline'

import settleUpAccept from './settleup/accept'
import settleUpDecline from './settleup/decline'

export default function(enhancer: Enhancer) {
    enhancer
        .onInlineClick(debtAccept)
        .onInlineClick(debtDecline)
        .onInlineClick(settleUpAccept)
        .onInlineClick(settleUpDecline)
}
