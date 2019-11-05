import TelegramBot from 'node-telegram-bot-api';

import debt from './debt';
import share from './share';

import { InlineHandler } from './inline_handler';

const handlers: InlineHandler[] = [ debt, share ];

export function onInline(this: TelegramBot, query: TelegramBot.InlineQuery) {
    for (const { regexp, onInline } of handlers) {
        const match = regexp.exec(query.query);
        if (match) {
            onInline.call(this, query, match);
            break;
        }
    }
}

export function onInlineResult(this: TelegramBot, result: TelegramBot.ChosenInlineResult) {
    for (const { regexp, onInlineResult } of handlers) {
        if (regexp.exec(result.query)) {
            if (onInlineResult) {
                onInlineResult.call(this, result);
            }
            break;
        }
    }
}

export function onInlineCallbackQuery(this: TelegramBot, query: TelegramBot.CallbackQuery) {
    //
}
