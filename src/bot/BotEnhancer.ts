import TelegramBot from 'node-telegram-bot-api'

import Enhancer from '#/enhancer/Enhancer'

import cancelOffer    from './buttons/cancel_offer'
import editOfferList  from './buttons/edit_group_offer_list'
import joinGroup      from './buttons/join_group'
import lockGroupOffer from './buttons/lock_group_offer'
import updateGroup    from './buttons/update_group'

import balance from './commands/balance'
import debt    from './commands/debt'
import members from './commands/members'
import reset   from './commands/reset'
import start   from './commands/start'

import ConnectEnhancers from './enhancers/ConnectEnhancements'

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
        .command(balance)
        .command(debt)
        .command(members)
        .command(reset)
        .command(start)
        .onClick(cancelOffer)
        .onClick(joinGroup)
        .onClick(updateGroup)
        .onClick(editOfferList)
        .onClick(lockGroupOffer)
        .inject(ConnectEnhancers)
        .inject(ConnectInline)
}
