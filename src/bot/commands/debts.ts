import debtPiece from '#/database/models/Debt'
import userPiece from '#/database/models/User'

import getLocale from '#/locale/Locale'

/**
 * Responds with list of debts in which user is involved
 */
const command: Enhancer.Command = {
    key: /\/debts/u,
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

async function formatter({ to, ...info }: DataBase.Debt.InDataBase) {
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
