import offerModel from '#/database/models/Offer'

import updateGroupDebtOfferMessage from '#/helpers/UpdateGroupDebtOfferMessage'

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
        const offer = await offerModel.getOffer(groupOfferId(message.chat.id, message.message_id))
        if (!offer || !isGroupOffer(offer)) {
            return fail(this, locale, message)
        }
        updateList(from.id, offer, match)
        updateGroupDebtOfferMessage(this, message.chat.id, message.message_id, offer, locale)
        return {
            text: locale.response.membersUpdated
        }
    }
}

export default button

function fail(bot: Enhancer.TelegramBot, locale: Locale, message: Enhancer.Message) {
    const text = locale.hybrid.offer.expired
    bot.editMessageText(text, {
        chat_id: message.chat.id,
        message_id: message.message_id
    })
    return { text }
}

function updateList(user_id: number, offer: DataBase.Offer.Document.Group, match: RegExpExecArray) {
    const list = match[1] == 'payers' ? offer.group.payer_ids : offer.group.member_ids
    if (match[2] == 'join') {
        list.addToSet(user_id)
    } else {
        list.pull(user_id)
    }
    return offer.save()
}
