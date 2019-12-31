import groupDebtReplyMarkup from './GroupDebtReplyMarkup'

export default function(bot: Enhancer.TelegramBot, chat_id: number, message_id: number,
        offer: DataBase.Offer.GroupType, locale: Locale) {
    return bot.editMessageText('', {
        chat_id, message_id, reply_markup: groupDebtReplyMarkup(locale)
    })
}
