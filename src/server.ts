import 'module-alias/register'

import https from 'https'

import {
    connectBot,
    enhanceBot,
    makeBot
} from '#/bot/BotEnhancer'

import {
    connectToDataBase
} from '#/database/ConnectToDataBase'

(async function() {
    const port = +(process.env.PORT ?? '8080')
    const url = process.env.URL ?? 'none'
    const token = process.env.TOKEN ?? 'none'
    const mongo_url = process.env.MONGODB_URI ?? 'none'

    const msInSec = 1000
    const secInMin = 60
    const keepAwakeMinutes = 15

    setInterval(() => https.get(url), msInSec * secInMin * keepAwakeMinutes)

    const bot = makeBot(token, port)    
    await Promise.all([
        connectToDataBase(mongo_url),
        connectBot(bot, url, token)
    ])
    return enhanceBot(bot)
})()
