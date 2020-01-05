import debtModel  from '#/database/models/Debt'
import groupModel from '#/database/models/Group'
import userModel  from '#/database/models/User'

import getLocale from '#/locale/Locale'

import { isGroup } from '#/util/Predicates'

/**
 * 1. Responds with list of debts/groups in which user is involved
 * 2. Responds with nonzero balances in group
 */
const command: Enhancer.Command = {
    key: /\/balance/u,
    async callback({ chat, from }) {
        const { messageTexts } = getLocale(from?.language_code)
        let message: string
        if (!from) {
            message = messageTexts.anon
        } else if (isGroup(chat)) {
            message = messageTexts.group.balances(await getChatBalances(chat))
        } else {
            message = messageTexts.debts(await getFormattedDebts(from))
        }
        return this.sendMessage(chat.id, message)
    }
}

export default command

async function formatter({ to, ...info }: DataBase.Debt) {
    if (to.is_group) {
        const toGroup = await groupModel.getGroup(to.id)
        if (!toGroup) {
            throw new Error('Title of group not found in database')
        }
        return {
            to: toGroup.title, ...info
        }
    } else {
        const toUser = await userModel.getUser(to.id)
        if (!toUser) {
            throw new Error('Name of bot user not found in database')
        }
        return {
            to: toUser.name, ...info
        }
    }
}

async function getFormattedDebts(user: Enhancer.User) {
    const debts = await debtModel.getDebts({ id: user.id, is_group: false })
    return Promise.all(debts.map(formatter))
}

async function getChatBalances(chat: import('node-telegram-bot-api').Chat) {
    const debts = await debtModel.getDebts({ id: chat.id, is_group: true })
    return Promise.all(debts.map(formatter))
}
