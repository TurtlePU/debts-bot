import TelegramBot from 'node-telegram-bot-api';

import { command } from './helper';

export default command(
    {
        from: {} as TelegramBot.User
    },
    {
        regexp: /\/start/,
        callback: async ({ msg, bot, locale, dataBase }) =>
            bot.sendMessage(msg.chat.id, locale.hi(await dataBase.name(msg.from.id)))
    }
);
