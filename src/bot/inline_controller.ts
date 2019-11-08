import TelegramBot from 'node-telegram-bot-api';

import { InlineHandler, InlineCallbackQuery, CallbackPiece, FeedbackPiece } from '@inline';

export default function ConnectInline(bot: TelegramBot, handlers: InlineHandler[]) {
    const withCallback = handlers.filter(hasCallback);
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
            return match ? onInline.call(bot, query, match) : [];
        });
        const results = (await Promise.all(pending)).flat();
        bot.answerInlineQuery(query.id, results);
    };

    function onInlineResult(result: TelegramBot.ChosenInlineResult) {
        for (const { regexp, onInlineResult } of withFeedback) {
            if (regexp.exec(result.query)) {
                onInlineResult.call(bot, result);
                break;
            }
        }
    };

    function onInlineCallbackQuery(query: InlineCallbackQuery) {
        if (!query.data) {
            return;
        }
        for (const { id, onInlineCallbackQuery } of withCallback) {
            if (query.data.startsWith(id)) {
                onInlineCallbackQuery.call(bot, query);
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
