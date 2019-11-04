import TelegramBot from 'node-telegram-bot-api';

import { command } from './helper';

export default command(
    {
        from: {} as TelegramBot.User
    },
    {
        regexp: /^\/start$/,
        callback: ({ msg, bot, locale }) => {
            bot.sendMessage(msg.chat.id, locale.hi(''));
        }
    }
);
