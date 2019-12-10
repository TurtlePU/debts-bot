export type ConnectionOptions = {
    bot: import('node-telegram-bot-api')
    dataBase: DataBase
    commands: Command<any>[]
    getLocale(code?: string): Locale
    getMe(): import('node-telegram-bot-api').User
}

export default function ConnectCommands(
        { bot, dataBase, commands, getLocale, getMe }: ConnectionOptions
) {
    for (const { regexp, requirements, callback } of commands) {
        const clb = callback.call(bot, dataBase, getMe)
        bot.onText(regexp, (msg, _match) => {
            if (msg.from) {
                dataBase.userPiece.updateUser(msg.from)
            }
            if (requirements.from && !msg.from) {
                bot.sendMessage(msg.chat.id, getLocale().anon)
            } else {
                const match = _match || undefined
                const locale = getLocale(msg.from && msg.from.language_code)
                clb({ msg, match, locale })
            }
        })
    }
}
