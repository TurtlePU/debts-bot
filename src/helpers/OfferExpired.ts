export default function(bot: Enhancer.TelegramBot, locale: Locale, message: Enhancer.Message) {
    const text = locale.hybrid.offer.expired
    bot.editMessageText(text, {
        chat_id: message.chat.id,
        message_id: message.message_id
    })
    return { text }
}
