import TelegramBot from 'node-telegram-bot-api'

import commands from '@commands'
import getLocale from '@locale'
import handlers from '@inline'
import { DataBase } from '@db'

import ConnectCommands from './command_controller'
import ConnectInline from './inline_controller'
import UseMarkdown from './message_decorator'
import { getMe, setMe } from './me_getter'

export default function Bot(url: string, token: string, port: number, dataBase: DataBase) {
    const bot = new TelegramBot(token, { webHook: { port } })
    UseMarkdown(bot)
    ConnectCommands({ bot, dataBase, commands, getLocale, getMe })
    ConnectInline({ bot, handlers, getLocale, dataBase, getMe })
    return {
        bot,
        async postInit() {
            await bot.setWebHook(`${url}/bot${token}`)
            await setMe(bot)
        }
    }
}
