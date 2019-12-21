import Enhancer from '#/bot-kit/Enhancer'

import debtAccept from './debt/accept'
import debtDecline from './debt/decline'

import settleUpAccept from './settleup/accept'
import settleUpDecline from './settleup/decline'

export default function(enhancer: Enhancer, dataBase: DataBase) {
    enhancer
        .onInlineClick(debtAccept)
        .onInlineClick(debtDecline(dataBase.offerPiece))
        .onInlineClick(settleUpAccept(dataBase))
        .onInlineClick(settleUpDecline(dataBase.offerPiece))
}
