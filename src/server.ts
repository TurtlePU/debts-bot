import 'module-alias/register'

import https from 'https'

import BotEnhancer from '#/bot/BotEnhancer'
import DataBase, { connect } from '#/database/DataBase'

const port = +(process.env.PORT || '8080')
const url = process.env.URL || 'none'
const token = process.env.TOKEN || 'none'
const mongo_url = process.env.MONGODB_URI || 'none'

const { postInit } = BotEnhancer(url, token, port, DataBase)

connect(mongo_url).then(postInit)

const msInSec = 1000
const secInMin = 60
const keepAwakeMinutes = 15

setInterval(() => https.get(url), msInSec * secInMin * keepAwakeMinutes)
