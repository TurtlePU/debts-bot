import TelegramBot from 'node-telegram-bot-api';

import { Command } from '@commands';
import InlineControllerImpl from '@inline';
import { DataBase } from '@db';
import { Locale } from '@locale';

export type BotOptions = {
    token: string
    port: number
    locale(code?: string): Locale,
    dataBase: DataBase
    commands: Command<any>[]
    inlineController: InlineControllerImpl
}

export default function Bot({
    token, port, locale, dataBase, commands, inlineController
}: BotOptions): TelegramBot {
    const bot = new TelegramBot(token, { webHook: { port } });

    const oldSendMessage = bot.sendMessage.bind(bot);
    bot.sendMessage = (chatId, text, options) =>
        oldSendMessage(chatId, text, { ...options, parse_mode: 'Markdown' });

    commands.forEach(({ regexp, requirements, callback }) => {
        const clb = callback.call(bot, dataBase);
        bot.onText(regexp, (msg, _match) => {
            if (msg.from) {
                dataBase.updateUser(msg.from);
            }
            if (requirements.from && !msg.from) {
                bot.sendMessage(msg.chat.id, locale().anon());
            } else {
                const match = _match || undefined;
                clb({
                    msg, match, locale: locale(msg.from && msg.from.language_code)
                });
            }
        });
    });

    bot.on('inline_query', query => inlineController.onInline(bot, query));
    bot.on('chosen_inline_result', result => inlineController.onInlineResult(bot, result));

    bot.on('callback_query', query => {
        if (query.inline_message_id) {
            inlineController.onInlineCallbackQuery(bot, query);
        } else {
            //
        }
    });

    return bot;
};
