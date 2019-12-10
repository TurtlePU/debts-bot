import TelegramBot from 'node-telegram-bot-api'

import getLocale from '#/locale/Locale'

import ConnectCommands from './ConnectCommands'
import ConnectInline from './ConnectInline'
import UseMarkdown from './MessageDecorator'
import { getMe, connect } from './PostInit'

import debts from './commands/debts'
import start from './commands/start'

import debt from './inline/debt/export'
import settleUp from './inline/settleup/export'

const commands = [ debts, start ]
const handlers = [ debt, settleUp ]

export default function Bot(url: string, token: string, port: number, dataBase: DataBase) {
    const bot = new TelegramBot(token, { webHook: { port } })
    UseMarkdown(bot)
    ConnectCommands({ bot, dataBase, commands, getLocale, getMe })
    ConnectInline({ bot, handlers, getLocale, dataBase, getMe })
    return { bot, postInit: connect(bot, url, token) }
}
