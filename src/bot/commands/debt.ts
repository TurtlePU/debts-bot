import mongoose from 'mongoose'

import groupModel from '#/database/models/Group'
import offerModel from '#/database/models/Offer'

import makeOfferId from '#/helpers/MakeOfferId'
import updateGroupDebtOfferMessage from '#/helpers/UpdateGroupDebtOfferMessage'

import getLocale from '#/locale/Locale'

import {
    group_debt_regexp
} from '#/bot/Constants'

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
            const offer = await offerModel.createGroupOffer(makeOfferId(chat.id, sent_message_id), {
                from_id,
                type: 'group',
                debt: {
                    amount, currency
                },
                group: {
                    payer_ids: new mongoose.Types.Array(from_id),
                    member_ids: new mongoose.Types.Array(...group.here_ids)
                }
            })
            return updateGroupDebtOfferMessage(
                this, chat.id, sent_message_id, offer as DataBase.Offer.GroupType, locale
            )
        } else {
            return this.sendMessage(chat.id, locale.wrongChatForDebt)
        }
    }
}

export default command
