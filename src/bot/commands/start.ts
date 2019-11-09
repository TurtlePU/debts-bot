import TelegramBot from 'node-telegram-bot-api'

import { command } from './helper'

export default command(
    {
        from: {} as TelegramBot.User
    },
    {
        regexp: /\/start/,
        callback(dataBase) {
            return ({ msg, locale }) =>
                this.sendMessage(msg.chat.id, locale.hi(dataBase.getName(msg.from)))
        }
    }
)
