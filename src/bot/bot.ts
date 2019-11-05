import TelegramBot from 'node-telegram-bot-api';

import commands from '@commands';
import * as inline from '@inline';
import { DataBase } from '@db';
import { Locale } from '@locale';

export default function Bot(
        token: string,
        port: number,
        locale: (code?: string) => Locale,
        dataBase: DataBase
): TelegramBot {
    const bot = new TelegramBot(token, { webHook: { port } });

    const oldSendMessage = bot.sendMessage.bind(bot);
    bot.sendMessage = (chatId, text, options) =>
        oldSendMessage(chatId, text, { ...options, parse_mode: 'Markdown' });

    commands.forEach(({ regexp, requirements, callback }) => {
        bot.onText(regexp, (msg, _match) => {
            console.log('caught command');
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
    });

    bot.on('inline_query', inline.onInline.bind(bot));
    bot.on('chosen_inline_result', inline.onInlineResult.bind(bot));

    return bot;
};
