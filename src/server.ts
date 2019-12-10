import 'module-alias/register'

import https from 'https'

import Bot from '#/bot/Bot'
import DataBase from '#/database/DataBase'

const port = +(process.env.PORT || '8080')
const url = process.env.URL || 'none'
const token = process.env.TOKEN || 'none'
const mongo_url = process.env.MONGODB_URI || 'none'

const { db, connect } = DataBase(mongo_url)
const { postInit } = Bot(url, token, port, db)

connect().then(postInit)

const msInSec = 1000
const secInMin = 60
const keepAwakeMinutes = 15

setInterval(() => https.get(url), msInSec * secInMin * keepAwakeMinutes)
