import debtPiece  from '#/database/models/Debt'

import { inline_debt_accept } from '#/bot/Constants'

import { acceptOffer } from '#/helpers/FallbackAnswers'

import { getUserName } from '#/util/StringUtils'

import { log } from '#/util/Log'

/**
 * Accepts debt offer on click
 */
const onClick: Enhancer.Inline.OnClickStrict = {
    key: inline_debt_accept,
    callback: acceptOffer('debt', getText, act)
}

function getText(
        locale: Locale, offer: DataBase.Offer.Outputs['debt'],
        from: DataBase.User, to: Enhancer.User
) {
    return locale.messageTexts.offerSaved(
        from.name, getUserName(to),
        offer.debt.amount, offer.debt.currency
    )
}

function act(offer: DataBase.Offer.Outputs['debt'], from: Enhancer.User) {
    return debtPiece.saveDebt({
        amount: offer.debt.amount,
        currency: offer.debt.currency,
        to: { id: from.id, is_group: false },
        from: { id: offer.from_id, is_group: false }
    }).catch(log)
}

export default onClick
