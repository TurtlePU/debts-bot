import debtModel  from '#/database/models/Debt'
import groupModel from '#/database/models/Group'
import offerModel from '#/database/models/Offer'

import getNames from '#/helpers/GetNames'
import offerExpired from '#/helpers/OfferExpired'

import getLocale from '#/locale/Locale'

import {
    group_debt_lock
} from '#/bot/Constants'

import {
    groupOfferId
} from '#/helpers/IdGenerator'

import {
    isGroupOffer
} from '#/util/Predicates'

const onClick: Enhancer.OnClickStrict = {
    key: group_debt_lock,
    async callback({ message, from }) {
        const locale = getLocale(from.language_code)
        const offer = await offerModel.getOffer(groupOfferId(message.chat.id, message.message_id))
        if (!isGroupOffer(offer)) {
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
        offer.remove()
        const group = await groupModel.makeOrGetGroup(message.chat)
        const entries = await debtModel.saveGroupDebt(group.id, payers, memers, offer.debt)
        updateClosedOfferMessage(
            this, locale, message.chat.id, message.message_id,
            entries, offer.debt.amount, offer.debt.currency
        )
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

async function updateClosedOfferMessage(
        bot: Enhancer.TelegramBot, locale: Locale, chat_id: number, message_id: number,
        entries: [number, number][], amount: number, currency: string
) {
    const names = await getNames(entries.map(([ id ]) => id))
    if (names.length != entries.length) {
        throw new Error('Not all names were found in database')
    }
    const updates = names.map((username, i) => ({ username, delta: entries[i][1] }))
    const text = locale.messageTexts.group.offerSaved(updates, amount, currency)
    return bot.editMessageText(text, { chat_id, message_id })
}
