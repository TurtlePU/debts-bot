import 'module-alias/register'

import https from 'https'

import Bot from '@bot'
import DB from '@db'

const port = +(process.env.PORT || '8080')
const url = process.env.URL || 'none'
const token = process.env.TOKEN || 'none'
const mongo_url = process.env.MONGODB_URI || 'none'

const db = DB(mongo_url)
const bot = Bot(token, port, db)

db.connect().then(() => bot.setWebHook(`${url}/bot${token}`))

const msInSec = 1000
const secInMin = 60
const keepAwakeMinutes = 15

setInterval(() => https.get(url), msInSec * secInMin * keepAwakeMinutes)
