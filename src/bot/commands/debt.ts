import groupModel from '#/database/models/Group'
import offerModel from '#/database/models/Offer'

import updateGroupDebtOfferMessage from '#/helpers/UpdateGroupDebtOfferMessage'

import getLocale from '#/locale/Locale'

import {
    group_debt_regexp
} from '#/bot/Constants'

import {
    groupOfferId
} from '#/helpers/IdGenerator'

import {
    isGroup
} from '#/util/Predicates'

const command: Enhancer.Command = {
    key: group_debt_regexp,
    async callback({ chat, from }, match) {
        const locale = getLocale(from?.language_code)
        if (isGroup(chat)) {
            const amount = +match[1]
            const currency = match[2] ?? locale.currency
            const { id: from_id } = <Enhancer.User> from
            const group = await groupModel.makeOrGetGroup(chat.id)
            const { message_id: sent_message_id } = await this.sendMessage(chat.id, locale.toUpdate)
            const offer = await offerModel.createOffer(
                groupOfferId(chat.id, sent_message_id), {
                    from_id,
                    type: 'group',
                    debt: {
                        amount,
                        currency
                    },
                    group: {
                        payer_ids: [ from_id ],
                        member_ids: group.here_ids
                    }
                })
            return updateGroupDebtOfferMessage(this, chat.id, sent_message_id, offer, locale)
        } else {
            return this.sendMessage(chat.id, locale.wrongChatForDebt)
        }
    }
}

export default command
