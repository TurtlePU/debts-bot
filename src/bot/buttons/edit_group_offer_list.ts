import offerModel from '#/database/models/Offer'

import UpdateGroupDebtOfferMessage from '#/helpers/UpdateGroupDebtOfferMessage'

import getLocale from '#/locale/Locale'

import {
    group_debt_button_regexp
} from '#/bot/Constants'

import {
    groupOfferId
} from '#/helpers/IdGenerator'

import {
    isGroupOffer
} from '#/util/Predicates'

const button: Enhancer.OnClick = {
    key: group_debt_button_regexp,
    async callback({ from, message }, match) {
        const locale = getLocale(from.language_code)
        const offer = await offerModel.getOffer(
            groupOfferId(message.chat.id, message.message_id)
        )
        if (!offer || !isGroupOffer(offer)) {
            const text = locale.hybrid.offer.expired
            this.editMessageText(text, {
                chat_id: message.chat.id,
                message_id: message.message_id
            })
            return { text }
        }
        const list = match[1] == 'payers' ? offer.group.payer_ids : offer.group.member_ids
        if (match[2] == 'join') {
            list.addToSet(from.id)
        } else {
            list.pull(from.id)
        }
        offer.save()
        UpdateGroupDebtOfferMessage(this, message.chat.id, message.message_id, offer, locale)
        return {
            text: locale.response.membersUpdated
        }
    }
}

export default button
