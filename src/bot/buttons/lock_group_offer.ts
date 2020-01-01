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
        const entries = applyOffer(group, payers, memers, offer.debt.amount, offer.debt.currency)
        group.save()
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

const { abs, floor, sign } = Math
const PRECISION = 100

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

function applyOffer(
        group: DataBase.Group.Document,
        payers: number[], memers: number[],
        amount: number, currency: string
) {
    const entries = mergeEntries(getEntries(payers, amount).concat(getEntries(memers, -amount)))
    const { balances } = group
    for (const [ id, delta ] of entries) {
        safeAdd(balances, id, delta, currency)
    }
    group.balances = balances
    return entries
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

function getEntries(ids: number[], amount: number): [number, number][] {
    const addend = getAddend(amount, ids.length)
    const leftover = getLeftover(amount, ids.length)
    return ids.map((id, i) => [ id, i == 0 ? addend + leftover : addend ])
}

function mergeEntries(entries: [number, number][]) {
    const deltaMap = new Map<number, number>()
    for (const [ id, addend ] of entries) {
        const delta = deltaMap.get(id) ?? 0
        deltaMap.set(id, delta + addend)
    }
    for (const [ key, value ] of deltaMap) {
        if (value == 0) {
            deltaMap.delete(key)
        }
    }
    return [ ...deltaMap.entries() ]
}
