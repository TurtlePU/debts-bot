import debtPiece from '#/database/models/Debt'
import userPiece from '#/database/models/User'

import getLocale from '#/locale/Locale'

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
            message = locale.anon
        } else {
            message = locale.debts(await getFormattedDebts(msg.from.id))
        }
        return this.sendMessage(msg.chat.id, message)
    }
}

export default command

async function formatter({ to, ...info }: DataBase.Debt.Output) {
    const toUser = await userPiece.getUser(to)
    if (!toUser) {
        throw new Error('Name of bot user not found in database')
    }
    return {
        to: toUser.name, ...info
    }
}

async function getFormattedDebts(id: number) {
    const debts = await debtPiece.getDebts(id)
    return Promise.all(debts.map(formatter))
}
