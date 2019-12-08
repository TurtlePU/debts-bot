import TelegramBot from 'node-telegram-bot-api'

import { command } from './helper'
import { DataBase, InnerDebt, UserPiece } from '@db'

export default command(
    {
        from: {} as TelegramBot.User
    },
    {
        regexp: /\/debts/u,
        callback(dataBase) {
            const debtsGetter = getFormattedDebts(dataBase)
            return async ({ msg, locale }) =>
                this.sendMessage(msg.chat.id, locale.debts(await debtsGetter(msg.from.id)))
        }
    }
)

function getFormattedDebts({ debtPiece, userPiece }: DataBase) {
    const mapper = fromInnerToFormatted(userPiece)
    return async (id: number) => {
        const debts = await debtPiece.getDebts(id)
        return Promise.all(debts.map(mapper))
    }
}

function fromInnerToFormatted(userPiece: UserPiece) {
    return async ({ to, ...info }: InnerDebt) => {
        const toUser = await userPiece.getUser(to)
        if (!toUser) {
            throw new Error('Name of bot user not found in database')
        }
        return {
            to: toUser.name, ...info
        }
    }
}
