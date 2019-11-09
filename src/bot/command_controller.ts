import TelegramBot from 'node-telegram-bot-api'

import { Command } from '@commands'
import { DataBase } from '@db'
import { Locale } from '@locale'

export type ConnectionOptions = {
    bot: TelegramBot
    dataBase: DataBase
    commands: Command<any>[]
    Locale(code?: string): Locale
}

export default function ConnectCommands({ bot, dataBase, commands, Locale }: ConnectionOptions) {
    for (const { regexp, requirements, callback } of commands) {
        const clb = callback.call(bot, dataBase)
        bot.onText(regexp, (msg, _match) => {
            if (msg.from) {
                dataBase.updateUser(msg.from)
            }
            if (requirements.from && !msg.from) {
                bot.sendMessage(msg.chat.id, Locale().anon())
            } else {
                const match = _match || undefined
                const locale = Locale(msg.from && msg.from.language_code)
                clb({ msg, match, locale })
            }
        })
    }
}
