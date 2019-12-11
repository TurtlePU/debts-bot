declare namespace Command {    
    type Context<MType = {}> = {
        msg: import('node-telegram-bot-api').Message & MType
        match?: RegExpExecArray
        locale: Locale
    }
    type Proto<MType = {}> = {
        regexp: RegExp
        callback: Bound<(ctx: Context<MType>) => void>
    }
}

declare type Command<MType = {}> = Command.Proto<MType> & {
    requirements: MType
}
