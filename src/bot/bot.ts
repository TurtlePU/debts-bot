import TelegramBot from 'node-telegram-bot-api';

import commands from '@commands';
import { DataBase } from '@db';
import { Locale } from '@locale';

export default function Bot(
        token: string,
        locale: (code?: string) => Locale,
        dataBase: DataBase
): TelegramBot {
    const bot = new TelegramBot(token);

    const oldSendMessage = bot.sendMessage.bind(bot);
    bot.sendMessage = (chatId, text, options) =>
        oldSendMessage(chatId, text, { ...options, parse_mode: 'Markdown' });

    commands.forEach(({ regexp, requirements, callback }) => {
        bot.onText(regexp, (msg, _match) => {
            if (msg.from) {
                dataBase.updateUser(msg.from);
            }
            if (requirements.from && !msg.from) {
                bot.sendMessage(msg.chat.id, locale().anon());
            } else {
                const match = _match || undefined;
                callback({
                    msg, match, bot, locale: locale(msg.from && msg.from.language_code), dataBase
                });
            }
        });
    })

    return bot;
};
