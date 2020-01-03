import Mongoose from 'mongoose'

import groupModel from '#/database/models/Group'
import offerModel from '#/database/models/Offer'
import userModel  from '#/database/models/User'

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
        const entries = await applyOffer(
            group, payers, memers, offer.debt.amount, offer.debt.currency
        )
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
const epsilon = 0.01

function getAddend(amount: number, size: number) {
    return sign(amount) * floor(abs(amount) / size * PRECISION) / PRECISION
}

function getLeftover(amount: number, size: number) {
    return amount - getAddend(amount, size) * size
}

async function safeAdd(
        balances: Mongoose.Types.Map<Mongoose.Types.Map<number>>,
        user_id: number, group_id: number,
        addend: number, currency: string
) {
    const key = '' + user_id
    const balance = balances.get(key) ?? await makeBalanceMap(user_id, group_id)
    const old_balance = balance.get(currency) ?? 0
    if (Math.abs(old_balance + addend) < epsilon) {
        balance.delete(currency)
        if (balance.size == 0) {
            const user = await userModel.getUser(user_id)
            if (user) {
                user.debt_holder_in.pull(group_id)
                user.save()
            }
            balances.delete(key)
        }
    } else {
        balance.set(currency, old_balance + addend)
        balances.set(key, balance)
    }
}

async function makeBalanceMap(
        user_id: number, group_id: number
): Promise<Mongoose.Types.Map<number>> {
    const user = await userModel.getUser(user_id)
    if (!user) {
        return new Mongoose.Types.Map()
    }
    user.debt_holder_in.addToSet(group_id)
    user.save()
    return new Mongoose.Types.Map()
}

async function applyOffer(
        group: DataBase.Group.Document,
        payers: number[], memers: number[],
        amount: number, currency: string
) {
    const entries = mergeEntries(getEntries(payers, amount).concat(getEntries(memers, -amount)))
    await Promise.all(entries.map(([ id, delta ]) => {
        group.markModified(`balances.${id}`)
        return safeAdd(group.balances, id, group.id, delta, currency)
    }))
    console.log(group)
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
