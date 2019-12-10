import TelegramBot from 'node-telegram-bot-api'

import { command } from './helper'
import { getUserName } from '@/util/string_utils'

export default command(
    {
        from: {} as TelegramBot.User
    },
    {
        regexp: /\/start/u,
        callback() {
            return ({ msg, locale }) =>
                this.sendMessage(msg.chat.id, locale.hi(getUserName(msg.from)))
        }
    }
)
