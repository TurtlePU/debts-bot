import TelegramBot from 'node-telegram-bot-api';
import { Locale } from '@locale';
import { DataBase } from '@db';

declare type InlineCallbackQuery = TelegramBot.CallbackQuery & {
    inline_message_id: string
    message: undefined
}

declare type CallbackPiece = {
    id: string
    onInlineCallbackQuery(this: TelegramBot, dataBase: DataBase):
        (query: InlineCallbackQuery, locale: Locale)
            => Promise<Partial<TelegramBot.AnswerCallbackQueryOptions>>
}

declare type FeedbackPiece = {
    onInlineResult(this: TelegramBot, dataBase: DataBase):
        (result: TelegramBot.ChosenInlineResult) => void
}

declare type InlineHandler = {
    regexp: RegExp
    onInline(this: TelegramBot, locale: Locale):
        (query: TelegramBot.InlineQuery, match: RegExpExecArray)
            => Promise<TelegramBot.InlineQueryResult[]>
}
