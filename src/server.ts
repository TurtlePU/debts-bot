import 'module-alias/register'

import {
    connectBot,
    enhanceBot,
    makeBot
} from '#/bot/BotEnhancer'

import {
    connectToDataBase
} from '#/database/ConnectToDataBase'

import { log } from '#/util/Log'

(async function() {
    // eslint-disable-next-line @typescript-eslint/no-extra-parens
    const port = +(process.env.PORT ?? '8080')
    const url = process.env.URL ?? 'none'
    const token = process.env.TOKEN ?? 'none'
    const mongo_url = process.env.MONGODB_URI ?? 'none'

    const bot = makeBot(token, port)
    await Promise.all([
        connectToDataBase(mongo_url),
        connectBot(bot, url, token)
    ])
    return enhanceBot(bot)
})().catch(log)
