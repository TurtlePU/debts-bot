export default function UseMarkdown(bot: import('node-telegram-bot-api')) {
    const oldSendMessage = bot.sendMessage.bind(bot)
    bot.sendMessage = (chatId, text, options) =>
        oldSendMessage(chatId, text, { ...options, parse_mode: 'Markdown' })
}
