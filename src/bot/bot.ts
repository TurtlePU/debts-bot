import TelegramBot from 'node-telegram-bot-api';

import commands from '@commands';

export default function Bot(
        token: string,
        locale: (code?: string) => Locale,
        dataBase: DataBase
): TelegramBot {
    const bot = new TelegramBot(token);

    commands.forEach(({ regexp, requirements, callback }) => {
        bot.onText(regexp, (msg, match) => {
            if (requirements.from && !msg.from) {
                bot.sendMessage(msg.chat.id, locale().anon());
            } else if (match) {
                callback({
                    msg, match, bot, locale: locale(msg.from && msg.from.language_code), dataBase
                });
            }
        });
    })

    return bot;
};
