import TelegramBot from 'node-telegram-bot-api'

import getLocale from '#/locale/export'

import ConnectCommands from './command_controller'
import ConnectInline from './inline_controller'
import UseMarkdown from './message_decorator'
import { getMe, connect } from './PostInit'

const commands = [
    require('./commands/start').default,
    require('./commands/debts').default
]

const handlers = [
    require('./inline/debt/export').default,
    require('./inline/settle_up/export').default
]

export default function Bot(url: string, token: string, port: number, dataBase: DataBase) {
    const bot = new TelegramBot(token, { webHook: { port } })
    UseMarkdown(bot)
    ConnectCommands({ bot, dataBase, commands, getLocale, getMe })
    ConnectInline({ bot, handlers, getLocale, dataBase, getMe })
    return { bot, postInit: connect(bot, url, token) }
}
