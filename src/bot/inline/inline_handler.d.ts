import TelegramBot from 'node-telegram-bot-api'
import { Locale } from '@locale'
import { DataBase } from '@db'

declare type InlineCallbackQuery = TelegramBot.CallbackQuery & {
    inline_message_id: string
    message: undefined
}

declare type BindedButtonCallback =
    (query: InlineCallbackQuery, locale: Locale)
    => Promise<Partial<TelegramBot.AnswerCallbackQueryOptions>>

declare type BindedResultCallback = (result: TelegramBot.ChosenInlineResult) => void

declare type BindedInlineCallback =
    (match: RegExpExecArray, locale: Locale, query: TelegramBot.InlineQuery)
    => Promise<TelegramBot.InlineQueryResult[]> | TelegramBot.InlineQueryResult[]

declare type CallbackPiece = {
    id: string
    onInlineCallbackQuery(this: TelegramBot, dataBase: DataBase): BindedButtonCallback
}

declare type FeedbackPiece = {
    onInlineResult(this: TelegramBot, dataBase: DataBase): BindedResultCallback
}

declare type InlineHandler = {
    regexp: RegExp
    onInline(this: TelegramBot, dataBase: DataBase): BindedInlineCallback
}
