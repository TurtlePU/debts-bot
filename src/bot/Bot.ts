import TelegramBot from 'node-telegram-bot-api'

import { UseMarkdown, UpdateUser } from './Enhancers'

import debts from './commands/debts'
import start from './commands/start'

import Enhancer from '#/bot-kit/Enhancer'
import ConnectInline from './inline/ConnectInline'

export default function Enhance(bot: TelegramBot, dataBase: DataBase) {
    const enhancer = new Enhancer(bot)
        .command(debts)
        .command(start)
        .enhance(UseMarkdown)
        .enhance(UpdateUser(dataBase.userPiece))
    ConnectInline(enhancer, dataBase)
}
