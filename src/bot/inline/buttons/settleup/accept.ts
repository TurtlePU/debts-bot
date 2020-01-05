import debtPiece  from '#/database/models/Debt'

import { inline_settleup_accept } from '#/bot/Constants'

import { acceptOffer } from '#/helpers/FallbackAnswers'

import { getUserName } from '#/util/StringUtils'

import { log } from '#/util/Log'

/**
 * Accepts settle-up offer on click
 */
const onClick: Enhancer.Inline.OnClickStrict = {
    key: inline_settleup_accept,
    callback: acceptOffer('settleup', getText, act)
}

function getText(locale: Locale, _: any, offerFrom: DataBase.User, from: Enhancer.User) {
    return locale.messageTexts.settledUp(offerFrom.name, getUserName(from))
}

function act(offer: DataBase.Offer.Document, from: Enhancer.User) {
    return debtPiece.clearDebts(
        { id: offer.from_id, is_group: false },
        { id: from.id, is_group: false }
    ).catch(log)
}

export default onClick
