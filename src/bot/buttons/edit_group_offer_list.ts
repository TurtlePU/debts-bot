import offerModel from '#/database/models/Offer'

import offerExpired from '#/helpers/OfferExpired'
import updateGroupDebtOfferMessage from '#/helpers/UpdateGroupDebtOfferMessage'

import getLocale from '#/locale/Locale'

import { group_debt_button_regexp } from '#/bot/Constants'

import { groupOfferId } from '#/helpers/IdGenerator'

import { isGroupOffer } from '#/util/Predicates'

/**
 * Updates lists of users in group offers
 */
const button: Enhancer.OnClick = {
    key: group_debt_button_regexp,
    async callback({ from, message }, match) {
        const locale = getLocale(from.language_code)
        const offer = await offerModel.getOffer(groupOfferId(message.chat.id, message.message_id))
        if (!isGroupOffer(offer)) {
            return offerExpired(this, locale, message)
        }
        await updateList(from.id, offer, match)
        await updateGroupDebtOfferMessage(this, message.chat.id, message.message_id, offer, locale)
        return {
            text: locale.response.membersUpdated
        }
    }
}

export default button

function updateList(
        user_id: number, offer: DataBase.Offer.Documents['group'], match: RegExpExecArray
) {
    const list = match[1] == 'payers' ? offer.group.payer_ids : offer.group.member_ids
    if (match[2] == 'join') {
        list.addToSet(user_id)
    } else {
        list.pull(user_id)
    }
    return offer.save()
}
