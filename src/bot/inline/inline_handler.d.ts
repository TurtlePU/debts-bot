import TelegramBot from 'node-telegram-bot-api';

declare type InlineHandler = {
    regexp: RegExp
    onInline: (this: TelegramBot, query: TelegramBot.InlineQuery, match: RegExpExecArray) => void
    onInlineResult?: (this: TelegramBot, result: TelegramBot.ChosenInlineResult) => void
}
