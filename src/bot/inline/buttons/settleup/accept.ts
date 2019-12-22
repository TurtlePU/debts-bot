import debtPiece  from '#/database/models/Debt'

import log from '#/util/Log'

import {
    inline_settleup_accept
} from '#/bot/Constants'

import {
    acceptOffer
} from '#/util/FallbackAnswers'

import {
    getUserName
} from '#/util/StringUtils'

/**
 * Accepts settle-up offer on click
 */
const onClick: Enhancer.Inline.OnClick = {
    key: inline_settleup_accept,
    callback: acceptOffer(isSettleUpOffer, getText, act)
}

function isSettleUpOffer(
        offer: DataBase.Offer.Document
): offer is DataBase.Offer.Document & DataBase.Offer.Base<'settleup'> {
    return offer.type == 'settleup'
}

function getText(locale: Locale, _: any, offerFrom: DataBase.User, from: Enhancer.User) {
    return locale.settleUp(offerFrom.name, getUserName(from))
}

function act(offer: DataBase.Offer, from: Enhancer.User) {
    return debtPiece.clearDebts(offer.from_id, from.id).catch(log)
}

export default onClick
