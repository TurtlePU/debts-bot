import TelegramBot from 'node-telegram-bot-api'

import commands from '@commands'
import getLocale from '@locale'
import handlers from '@inline'
import { DataBase } from '@db'
import ConnectCommands from './command_controller'
import ConnectInline from './inline_controller'
import UseMarkdown from './message_decorator'

export default function Bot(token: string, port: number, dataBase: DataBase): TelegramBot {
    const bot = new TelegramBot(token, { webHook: { port } })
    UseMarkdown(bot)
    ConnectCommands({ bot, dataBase, commands, getLocale })
    ConnectInline({ bot, handlers, getLocale, dataBase })
    return bot
}
