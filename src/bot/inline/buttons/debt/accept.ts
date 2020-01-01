import debtPiece  from '#/database/models/Debt'

import log from '#/util/Log'

import {
    inline_debt_accept
} from '#/bot/Constants'

import {
    acceptOffer
} from '#/helpers/FallbackAnswers'

import {
    getUserName
} from '#/util/StringUtils'

/**
 * Accepts debt offer on click
 */
const onClick: Enhancer.Inline.OnClickStrict = {
    key: inline_debt_accept,
    callback: acceptOffer(isDebtOffer, getText, act)
}

function isDebtOffer(offer: DataBase.Offer.Document): offer is DataBase.Offer.Document.Debt {
    return offer.type == 'debt'
}

function getText(
        locale: Locale, offer: DataBase.Offer.Types.Debt, from: DataBase.User, to: Enhancer.User) {
    return locale.messageTexts.offerSaved(
        from.name, getUserName(to),
        offer.debt.amount, offer.debt.currency
    )
}

function act(offer: DataBase.Offer.Types.Debt, from: Enhancer.User) {
    return debtPiece.saveDebt({
        amount: offer.debt.amount,
        currency: offer.debt.currency,
        to: from.id,
        from: offer.from_id
    }).catch(log)
}

export default onClick
