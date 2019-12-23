import TelegramBot from 'node-telegram-bot-api'

import Enhancer from '#/enhancer/Enhancer'

import debts from './commands/debts'
import start from './commands/start'

import alwaysUseMarkdown from './enhancers/UseMarkdown'
import alwaysUpdateUser  from './enhancers/UpdateUser'

import ConnectInline from './inline/ConnectInline'

/**
 * Makes bot with given config
 * @param token bot token
 * @param port port on which to listen for Telegram events
 */
export function makeBot(token: string, port: number) {
    return new TelegramBot(token, { webHook: { port } })
}

/**
 * Sets webhook on given url
 * @param bot bot to hook
 * @param url base url on which to hook
 * @param token token of a bot
 */
export function connectBot(bot: TelegramBot, url: string, token: string) {
    return bot.setWebHook(`${url}/bot${token}`)
}

/**
 * Connects debt-bot commands to plain Telegram bot
 * @param bot bot itself
 */
export function enhanceBot(bot: TelegramBot) {
    new Enhancer(bot)
        .command(debts)
        .command(start)
        .enhance(alwaysUseMarkdown)
        .enhance(alwaysUpdateUser)
        .inject(ConnectInline)
}
