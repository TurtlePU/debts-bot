import debtPiece  from '#/database/models/DebtModel'

import log from '#/util/Log'

import {
    inline_debt_accept
} from '#/bot/Constants'

import {
    acceptOffer
} from '#/util/FallbackAnswers'

import {
    getUserName
} from '#/util/StringUtils'

const onClick: Enhancer.Inline.OnClick = {
    key: inline_debt_accept,
    callback: acceptOffer(isDebtOffer, getText, act)
}

function isDebtOffer(offer: DataBase.Offer.Doc): offer is DataBase.Offer.Doc & DataBase.DebtOffer {
    return offer.type == 'debt'
}


function getText(
        locale: Locale, offer: DataBase.DebtOffer, offerFrom: DataBase.User, from: Enhancer.User) {
    return locale.offer.saved(
        offerFrom.name, getUserName(from),
        offer.debt.amount, offer.debt.currency
    )
}

function act(offer: DataBase.DebtOffer, from: Enhancer.User) {
    return debtPiece.saveDebt({
        amount: offer.debt.amount,
        currency: offer.debt.currency,
        to: from.id,
        from: offer.from_id
    }).catch(log)
}

export default onClick
