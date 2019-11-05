import TelegramBot from 'node-telegram-bot-api';

import { DataBase } from '@db';
import { Locale } from '@locale';

declare type Context<MType = {}> = {
    bot: TelegramBot
    msg: TelegramBot.Message & MType
    match?: RegExpExecArray
    locale: Locale
    dataBase: DataBase
}

declare type CommandProto<MType = {}> = {
    regexp: RegExp
    callback: (ctx: Context<MType>) => void
}

declare type Command<MType = {}> = CommandProto<MType> & {
    requirements: MType
}
