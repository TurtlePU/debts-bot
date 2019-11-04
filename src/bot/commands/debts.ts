import TelegramBot from 'node-telegram-bot-api';

import { command } from './helper';

export default command(
    {
        from: {} as TelegramBot.User
    },
    {
        regexp: /\/debts/,
        callback: async ({ msg, bot, locale, dataBase }) =>
            bot.sendMessage(msg.chat.id, locale.debts(await dataBase.debts(msg.from.id)))
    }
);
