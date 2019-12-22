import debtPiece  from '#/database/models/DebtModel'

import {
    inline_settleup_accept
} from '#/bot/Constants'

import {
    acceptOffer
} from '#/util/FallbackAnswers'

import {
    getUserName
} from '#/util/StringUtils'

const onClick: Enhancer.Inline.OnClick = {
    key: inline_settleup_accept,
    callback: acceptOffer(isSettleUpOffer, getText, act)
}

function isSettleUpOffer(
        offer: DataBase.Offer.Doc): offer is DataBase.Offer.Doc & DataBase.OfferBase<'settleup'> {
    return offer.type == 'settleup'
}

function getText(locale: Locale, _: any, offerFrom: DataBase.User, from: Enhancer.User) {
    return locale.settleUp(offerFrom.name, getUserName(from))
}

function act(offer: DataBase.Offer, from: Enhancer.User) {
    return debtPiece.clearDebts(offer.from_id, from.id)
}

export default onClick
