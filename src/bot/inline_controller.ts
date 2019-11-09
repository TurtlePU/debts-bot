import TelegramBot from 'node-telegram-bot-api';

import { InlineHandler, InlineCallbackQuery, CallbackPiece, FeedbackPiece } from '@inline';
import { Locale } from '@locale';
import { DataBase } from '@db';

export type InlineOptions = {
    bot: TelegramBot
    Locale(code?: string): Locale
    handlers: InlineHandler[]
    dataBase: DataBase
}

export default function ConnectInline({ bot, handlers, Locale, dataBase }: InlineOptions) {
    const withCallback = handlers.filter(hasCallback).map(({ id, onInlineCallbackQuery }) => ({ id, callback: onInlineCallbackQuery.call(bot, dataBase) }));
    const withFeedback = handlers.filter(acceptsFeedback);
    
    bot.on('inline_query', onInline);
    bot.on('chosen_inline_result', onInlineResult);

    bot.on('callback_query', query => {
        if (isInlineCallbackQuery(query)) {
            onInlineCallbackQuery(query);
        }
    });

    async function onInline(query: TelegramBot.InlineQuery) {
        const pending = handlers.map(({ regexp, onInline }) => {
            const match = regexp.exec(query.query);
            return match ? onInline.call(bot, Locale(query.from.language_code))(query, match) : [];
        });
        const results = (await Promise.all(pending)).flat();
        bot.answerInlineQuery(query.id, results);
    };

    function onInlineResult(result: TelegramBot.ChosenInlineResult) {
        for (const { regexp, onInlineResult } of withFeedback) {
            if (regexp.exec(result.query)) {
                onInlineResult.call(bot, dataBase)(result);
                break;
            }
        }
    };

    async function onInlineCallbackQuery(query: InlineCallbackQuery) {
        if (!query.data) {
            return;
        }
        for (const { id, callback } of withCallback) {
            if (query.data.startsWith(id)) {
                bot.answerCallbackQuery(query.id,
                    await callback(query, Locale(query.from.language_code)));
                break;
            }
        }
    };
}

function isInlineCallbackQuery(query: TelegramBot.CallbackQuery): query is InlineCallbackQuery {
    return !!query.inline_message_id;
}

function hasCallback(handler: InlineHandler): handler is InlineHandler & CallbackPiece {
    return !!(handler as InlineHandler & CallbackPiece).id;
}

function acceptsFeedback(handler: InlineHandler): handler is InlineHandler & FeedbackPiece {
    return !!(handler as InlineHandler & FeedbackPiece).onInlineResult;
}
