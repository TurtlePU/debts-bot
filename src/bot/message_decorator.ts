import TelegramBot from 'node-telegram-bot-api';

export default function UseMarkdown(bot: TelegramBot) {
    const oldSendMessage = bot.sendMessage.bind(bot);
    bot.sendMessage = (chatId, text, options) =>
        oldSendMessage(chatId, text, { ...options, parse_mode: 'Markdown' });
}
