import groupModel from '#/database/models/Group'
import offerModel from '#/database/models/Offer'

import updateGroupDebtOfferMessage from '#/helpers/UpdateGroupDebtOfferMessage'

import getLocale from '#/locale/Locale'

import { group_debt_regexp } from '#/bot/Constants'

import { groupOfferId } from '#/helpers/IdGenerator'

import { isGroup } from '#/util/Predicates'

const command: Enhancer.Command = {
    key: group_debt_regexp,
    async callback({ chat, from }, match) {
        const locale = getLocale(from?.language_code)
        if (isGroup(chat) && from) {
            const { message_id } = await this.sendMessage(chat.id, locale.messageTexts.toUpdate)
            const { here_ids } = await groupModel.makeOrGetGroup(chat)
            const offer = await makeOffer(locale, chat.id, message_id, from.id, match, here_ids)
            return updateGroupDebtOfferMessage(this, chat.id, message_id, offer, locale)
        } else {
            return this.sendMessage(chat.id, locale.messageTexts.wrongChatForDebt)
        }
    }
}

export default command

function makeOffer(
        locale: Locale, chat_id: number, message_id: number,
        from_id: number, match: RegExpExecArray, member_ids: number[]
) {
    return offerModel.createOffer('group', {
        id: groupOfferId(chat_id, message_id),
        from_id,
        debt: {
            amount: +match[1],
            currency: match[2] ?? locale.currency
        },
        group: {
            payer_ids: [ from_id ],
            member_ids
        }
    })
}
