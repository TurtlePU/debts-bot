import TelegramBot from 'node-telegram-bot-api';

import { DataBase } from '@db';
import { Locale } from '@locale';

declare type Context<MType = {}> = {
    msg: TelegramBot.Message & MType
    match?: RegExpExecArray
    locale: Locale
}

declare type CommandProto<MType = {}> = {
    regexp: RegExp
    callback(this: TelegramBot, dataBase: DataBase): (ctx: Context<MType>) => void
}

declare type Command<MType = {}> = CommandProto<MType> & {
    requirements: MType
}
