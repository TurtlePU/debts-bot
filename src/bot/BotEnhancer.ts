import TelegramBot from 'node-telegram-bot-api'

import Enhancer from '#/enhancer/Enhancer'

import debts from './commands/debts'
import start from './commands/start'

import ConnectInline from './inline/ConnectInline'

import {
    alwaysUpdateUser,
    alwaysUseMarkdown
} from './Enhancers'

export function makeBot(token: string, port: number) {
    return new TelegramBot(token, { webHook: { port } })
}

export function connectBot(bot: TelegramBot, url: string, token: string) {
    return bot.setWebHook(`${url}/bot${token}`)
}

export function enhanceBot(bot: TelegramBot) {
    new Enhancer(bot)
        .command(debts)
        .command(start)
        .enhance(alwaysUseMarkdown)
        .enhance(alwaysUpdateUser)
        .inject(ConnectInline)
}
