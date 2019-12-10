declare type Context<MType = {}> = {
    msg: import('node-telegram-bot-api').Message & MType
    match?: RegExpExecArray
    locale: Locale
}

declare type CommandProto<MType = {}> = {
    regexp: RegExp
    callback: Bound<(ctx: Context<MType>) => void>
}

declare type Command<MType = {}> = CommandProto<MType> & {
    requirements: MType
}
