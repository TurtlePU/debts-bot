import debtModel  from '#/database/models/Debt'
import groupModel from '#/database/models/Group'
import userModel  from '#/database/models/User'

import getLocale from '#/locale/Locale'

import {
    isGroup, isDefined
} from '#/util/Predicates'
import getNames from '#/helpers/GetNames'

/**
 * 1. Responds with list of debts/groups in which user is involved
 * TODO:
 * 2. Responds with nonzero balances in group
 */
const command: Enhancer.Command = {
    key: /\/balance/u,
    async callback(msg) {
        const locale = getLocale(msg.from?.language_code)
        let message: string
        if (!msg.from) {
            message = locale.messageTexts.anon
        } else if (isGroup(msg.chat)) {
            message = locale.messageTexts.group.balances(await getChatBalances(msg.chat))
        } else {
            message = locale.messageTexts.debts(await getFormattedDebts(msg.from))
        }
        return this.sendMessage(msg.chat.id, message)
    }
}

export default command

async function formatter({ to, ...info }: DataBase.Debt) {
    const toUser = await userModel.getUser(to)
    if (!toUser) {
        throw new Error('Name of bot user not found in database')
    }
    return {
        to: toUser.name, ...info
    }
}

async function getFormattedDebts(user: Enhancer.User) {
    const debts = await debtModel.getDebts(user.id)
    const { debt_holder_in } = await userModel.getUser(user.id) ?? await userModel.updateUser(user)
    return (
        await Promise.all(debts.map(formatter))).concat(
        await getUserBalances(user.id, debt_holder_in)
    )
}

async function getUserBalances(user_id: number, group_list: number[]) {
    const groups = (
        await Promise.all(group_list.map(id => groupModel.getGroup(id)))
    ).filter(isDefined)
    return groups.map(({ balances, title: to }) => {
        const currencies = balances.get('' + user_id) ?? new Map<string, number>()
        return [ ...currencies.entries() ].map(([ currency, amount ]) => ({ currency, amount, to }))
    }).flat()
}

async function getChatBalances(chat: import('node-telegram-bot-api').Chat) {
    const group = await groupModel.makeOrGetGroup(chat)
    const names = await getNames([ ...group.balances.keys() ].map(val => +val))
    let i = 0
    const balances: Locale.Debt[] = []
    for (const [ _, map ] of group.balances) {
        const to = names[i++]
        for (const [ currency, amount ] of map) {
            balances.push({ currency, amount, to })
        }
    }
    return balances
}
