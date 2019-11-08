import TelegramBot from 'node-telegram-bot-api';

import { InlineHandler } from './inline/inline_handler';

export default function ConnectInline(bot: TelegramBot, handlers: InlineHandler[]) {
    bot.on('inline_query', onInline);
    bot.on('chosen_inline_result', onInlineResult);

    bot.on('callback_query', query => {
        if (query.inline_message_id) {
            onInlineCallbackQuery(query);
        }
    });

    function onInline(query: TelegramBot.InlineQuery) {
        for (const { regexp, onInline } of handlers) {
            const match = regexp.exec(query.query);
            if (match) {
                onInline.call(bot, query, match);
                break;
            }
        }
    };

    function onInlineResult(result: TelegramBot.ChosenInlineResult) {
        for (const { regexp, onInlineResult } of handlers) {
            if (regexp.exec(result.query)) {
                if (onInlineResult) {
                    onInlineResult.call(bot, result);
                }
                break;
            }
        }
    };

    function onInlineCallbackQuery(query: TelegramBot.CallbackQuery) {
        //
    };
}
