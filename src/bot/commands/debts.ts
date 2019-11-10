import TelegramBot from 'node-telegram-bot-api'

import { command } from './helper'

export default command(
    {
        from: {} as TelegramBot.User
    },
    {
        regexp: /\/debts/u,
        callback(dataBase) {
            return async ({ msg, locale }) =>
                this.sendMessage(msg.chat.id, locale.debts(await dataBase.getDebts(msg.from.id)))
        }
    }
)
