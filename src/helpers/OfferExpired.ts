export default async function(
        bot: Enhancer.TelegramBot, { hybrid }: Locale, { chat, message_id }: Enhancer.Message
) {
    const text = hybrid.offer.expired
    await bot.editMessageText(text, { chat_id: chat.id, message_id })
    return { text }
}
