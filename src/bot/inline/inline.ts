import TelegramBot from 'node-telegram-bot-api';

import { InlineHandler } from './inline_handler';
import { InlineController } from './inline_controller';

export default class InlineControllerImpl implements InlineController {
    private readonly handlers: InlineHandler[];

    constructor(handlers: InlineHandler[]) {
        this.handlers = handlers;
    }

    onInline(bot: TelegramBot, query: TelegramBot.InlineQuery) {
        for (const { regexp, onInline } of this.handlers) {
            const match = regexp.exec(query.query);
            if (match) {
                onInline.call(bot, query, match);
                break;
            }
        }
    }

    onInlineResult(bot: TelegramBot, result: TelegramBot.ChosenInlineResult) {
        for (const { regexp, onInlineResult } of this.handlers) {
            if (regexp.exec(result.query)) {
                if (onInlineResult) {
                    onInlineResult.call(bot, result);
                }
                break;
            }
        }
    }

    onInlineCallbackQuery(bot: TelegramBot, query: TelegramBot.CallbackQuery) {
        //
    }
}
