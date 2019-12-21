import userPiece from '#/database/models/UserModel'
import debtPiece from '#/database/models/DebtModel'
import getLocale from '#/locale/Locale'

import {
    noUserResponse
} from '#/util/FallbackAnswers'

const command: Enhancer.Command = {
    key: /\/debts/u,
    async callback(msg) {
        if (!msg.from) {
            return noUserResponse.call(this, msg)
        } else {
            return this.sendMessage(msg.chat.id,
                getLocale(msg.from.language_code).debts(await getFormattedDebts(msg.from.id)))
        }
    }
}

export default command

async function formatter({ to, ...info }: InnerDebt) {
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
