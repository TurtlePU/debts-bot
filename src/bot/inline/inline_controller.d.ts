import TelegramBot from 'node-telegram-bot-api';

declare type InlineController = {
    onInline(bot: TelegramBot, query: TelegramBot.InlineQuery): void;
    onInlineResult(bot: TelegramBot, result: TelegramBot.ChosenInlineResult): void;
    onInlineCallbackQuery(bot: TelegramBot, query: TelegramBot.CallbackQuery): void;
}
