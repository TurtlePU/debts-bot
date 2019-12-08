import TelegramBot from 'node-telegram-bot-api'

var me: TelegramBot.User

export async function setMe(bot: TelegramBot) {
    me = await bot.getMe()
}

export function getMe() {
    return me
}
