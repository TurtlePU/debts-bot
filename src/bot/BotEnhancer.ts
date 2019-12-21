import TelegramBot from 'node-telegram-bot-api'

import { alwaysUseMarkdown, alwaysUpdateUser } from './Enhancers'

import debts from './commands/debts'
import start from './commands/start'

import Enhancer from '#/bot-kit/Enhancer'
import ConnectInline from './inline/ConnectInline'

export function makeBot(token: string, port: number) {
    return new TelegramBot(token, { webHook: { port } })
}

export function enhanceBot(bot: TelegramBot) {
    const enhancer = new Enhancer(bot)
        .command(debts)
        .command(start)
        .enhance(alwaysUseMarkdown)
        .enhance(alwaysUpdateUser)
    ConnectInline(enhancer)
}
