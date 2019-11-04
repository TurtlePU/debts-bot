import TelegramBot = require("node-telegram-bot-api");

declare type Context<MType = {}> = {
    bot: TelegramBot
    msg: TelegramBot.Message & MType
    match?: RegExpExecArray
    locale: Locale
}

declare type CommandProto<MType = {}> = {
    regexp: RegExp,
    callback: (ctx: Context<MType>) => void;
}

declare type Command<MType = {}> = CommandProto<MType> & {
    requirements: MType
}
