import getLocale from '#/locale/Locale'

export function noUserResponse(this: Enhancer.TelegramBot, msg: Enhancer.Message) {
    return this.sendMessage(msg.chat.id, getLocale().anon)
}
