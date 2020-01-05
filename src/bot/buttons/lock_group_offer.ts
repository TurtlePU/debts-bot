import debtModel  from '#/database/models/Debt'
import groupModel from '#/database/models/Group'
import offerModel from '#/database/models/Offer'

import getNames     from '#/helpers/GetNames'
import offerExpired from '#/helpers/OfferExpired'

import getLocale from '#/locale/Locale'

import { group_debt_lock } from '#/bot/Constants'

import { groupOfferId } from '#/helpers/IdGenerator'

import { checkOfferType } from '#/util/Predicates'

const onClick: Enhancer.OnClickStrict = {
    key: group_debt_lock,
    async callback({ message, from }) {
        const locale = getLocale(from.language_code)
        const offer = await offerModel.getOffer(groupOfferId(message.chat.id, message.message_id))
        if (!checkOfferType('group', offer)) {
            return offerExpired(this, locale, message)
        }
        if (offer.group.payer_ids.length == 0) {
            // TODO: text in locale
            return { text: 'Should be at least one payer' }
        }
        if (offer.group.member_ids.length == 0) {
            // TODO: text in locale
            return { text: 'Should be at least one member' }
        }
        const payers = [ ...offer.group.payer_ids ].sort((a, b) => a - b)
        const memers = [ ...offer.group.member_ids ].sort((a, b) => a - b)
        if (arrayEquals(payers, memers)) {
            // TODO: text in locale
            return { text: 'Lists should not be equal' }
        }
        await Promise.all([
            offer.remove(),
            applyOfferAndUpdateMessage(this, message, locale, offer.debt, payers, memers)
        ])
        // TODO: text in locale
        return { text: 'Success' }
    }
}

export default onClick

function arrayEquals(a: number[], b: number[]) {
    if (a.length != b.length) {
        return false
    }
    for (let i = 0; i != a.length; ++i) {
        if (a[i] != b[i]) {
            return false
        }
    }
    return true
}

async function applyOfferAndUpdateMessage(
        bot: Enhancer.TelegramBot, { chat, message_id }: Enhancer.Message, locale: Locale,
        debt: DataBase.Debt.Info, from: number[], to: number[]
) {
    const group = await groupModel.makeOrGetGroup(chat)
    const entries = await debtModel.saveGroupDebt(group.id, from, to, debt)
    const names = await getNames(entries.map(([ id ]) => id))
    if (names.length != entries.length) {
        throw new Error('Not all names were found in database')
    }
    const updates = names.map((username, i) => ({ username, delta: entries[i][1] }))
    const text = locale.messageTexts.group.offerSaved(updates, debt.amount, debt.currency)
    return bot.editMessageText(text, { chat_id: chat.id, message_id })
}
