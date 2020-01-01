import Mongoose from 'mongoose'

import groupModel from '#/database/models/Group'
import offerModel from '#/database/models/Offer'

import OfferExpired from '#/helpers/OfferExpired'

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
            return OfferExpired(this, locale, message)
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
        const group = await groupModel.makeOrGetGroup(message.chat.id)
        splitWise(group, payers, offer.debt.amount, offer.debt.currency)
        splitWise(group, memers, -offer.debt.amount, offer.debt.currency)
        group.save()
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
    const addend = sign(amount) * floor(abs(amount) / ids.length * PRECISION) / PRECISION
    const balances = group.balances
    for (const id of ids) {
        safeAdd(balances, id, addend, currency)
    }
    const leftover = amount - addend * ids.length
    safeAdd(balances, ids[0], leftover, currency)
    group.balances = balances
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
