import debtPiece  from '#/database/models/Debt'

import log from '#/util/Log'

import {
    inline_settleup_accept
} from '#/bot/Constants'

import {
    acceptOffer
} from '#/helpers/FallbackAnswers'

import {
    getUserName
} from '#/util/StringUtils'

/**
 * Accepts settle-up offer on click
 */
const onClick: Enhancer.Inline.OnClickStrict = {
    key: inline_settleup_accept,
    callback: acceptOffer(isSettleUpOffer, getText, act)
}

function isSettleUpOffer(
        offer: DataBase.Offer.Document
): offer is DataBase.Offer.Document.SettleUp {
    return offer.type == 'settleup'
}

function getText(locale: Locale, _: any, offerFrom: DataBase.User, from: Enhancer.User) {
    return locale.messageTexts.settledUp(offerFrom.name, getUserName(from))
}

function act(offer: DataBase.Offer, from: Enhancer.User) {
    return debtPiece.clearDebts(offer.from_id, from.id).catch(log)
}

export default onClick
