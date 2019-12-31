import offerModel from '#/database/models/Offer'

import UpdateGroupDebtOfferMessage from '#/helpers/UpdateGroupDebtOfferMessage'

import getLocale from '#/locale/Locale'

import {
    group_debt_button_regexp
} from '#/bot/Constants'

import {
    groupOfferId
} from '#/helpers/IdGenerator'
import { isGroupOffer } from '#/util/Predicates'

const button: Enhancer.OnClick = {
    key: group_debt_button_regexp,
    async callback(query, match) {
        const offer = await offerModel.getOffer(
            groupOfferId(query.message.chat.id, query.message.message_id)
        )
        if (!offer || !isGroupOffer(offer)) {
            return {
                text: 'Fail'
            }
        }
        const list = match[1] == 'payers' ? offer.group.payer_ids : offer.group.member_ids
        if (match[2] == 'join') {
            list.addToSet(query.from.id)
        } else {
            list.pull(query.from.id)
        }
        offer.save()
        UpdateGroupDebtOfferMessage(
            this, query.message.chat.id, query.message.message_id, offer,
            getLocale(query.from.language_code))
        return {
            text: 'Success'
        }
    }
}

export default button
