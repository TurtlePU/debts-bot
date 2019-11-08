import TelegramBot from 'node-telegram-bot-api';

declare type InlineCallbackQuery = TelegramBot.CallbackQuery & {
    inline_message_id: string
    message: undefined
}

declare type CallbackPiece = {
    id: string
    onInlineCallbackQuery(this: TelegramBot, query: InlineCallbackQuery): void
}

declare type FeedbackPiece = {
    onInlineResult(this: TelegramBot, result: TelegramBot.ChosenInlineResult): void
}

declare type InlineHandler = {
    regexp: RegExp
    onInline(this: TelegramBot, query: TelegramBot.InlineQuery, match: RegExpExecArray)
        : Promise<TelegramBot.InlineQueryResult[]>
}
