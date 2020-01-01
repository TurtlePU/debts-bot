import Mongoose from 'mongoose'

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
        const group = await groupModel.makeOrGetGroup(message.chat.id)
        splitWise(group, payers, offer.debt.amount, offer.debt.currency)
        splitWise(group, memers, -offer.debt.amount, offer.debt.currency)
        group.save()
        updateClosedOfferMessage(
            this, locale, message.chat.id, message.message_id,
            payers, memers, offer.debt.amount, offer.debt.currency
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

const { abs, floor, sign } = Math
const PRECISION = 100

function splitWise(group: DataBase.Group, ids: number[], amount: number, currency: string) {
    const addend = getAddend(amount, ids.length)
    const balances = group.balances
    for (const id of ids) {
        safeAdd(balances, id, addend, currency)
    }
    const leftover = getLeftover(amount, ids.length)
    safeAdd(balances, ids[0], leftover, currency)
    group.balances = balances
    return ids.map((_, i) => i == 0 ? addend + leftover : addend)
}

function getAddend(amount: number, size: number) {
    return sign(amount) * floor(abs(amount) / size * PRECISION) / PRECISION
}

function getLeftover(amount: number, size: number) {
    return amount - getAddend(amount, size) * size
}

function safeAdd(
        balances: Mongoose.Types.Map<Mongoose.Types.Map<number>>, id: number,
        addend: number, currency: string
) {
    const key = '' + id
    const balance = balances.get(key) ?? new Mongoose.Types.Map()
    const old_balance = balance.get(currency) ?? 0
    if (old_balance + addend == 0) {
        balance.delete(currency)
        if (balance.size == 0) {
            balances.delete(key)
        }
    } else {
        balance.set(currency, old_balance + addend)
        balances.set(key, balance)
    }
}

async function updateClosedOfferMessage(
        bot: Enhancer.TelegramBot, locale: Locale, chat_id: number, message_id: number,
        payer_ids: number[], memer_ids: number[], amount: number, currency: string
) {
    const [ payer_names, memer_names ] = await Promise.all([
        getNames(payer_ids), getNames(memer_ids)
    ])
    const updates = getUpdates(payer_names, amount).concat(getUpdates(memer_names, -amount))
    const text = locale.messageTexts.group.offerSaved(updates, amount, currency)
    return bot.editMessageText(text, { chat_id, message_id })
}

function getUpdates(names: string[], amount: number) {
    const addend = getAddend(amount, names.length)
    const leftover = getLeftover(amount, names.length)
    return names.map((username, i) => ({ username, delta: i == 0 ? addend + leftover : addend }))
}
