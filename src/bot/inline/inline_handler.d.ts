import TelegramBot from 'node-telegram-bot-api'
import { Locale } from '@locale'
import { DataBase } from '@db'

declare type InlineCallbackQuery = TelegramBot.CallbackQuery & {
    inline_message_id: string
    data: string
    message: undefined
}

declare type ButtonAswer = Partial<TelegramBot.AnswerCallbackQueryOptions>

declare type BindedButtonCallback =
    (query: InlineCallbackQuery, locale: Locale) => Promise<ButtonAswer> | ButtonAswer

declare type BindedResultCallback = (result: TelegramBot.ChosenInlineResult) => void

declare type BindedInlineCallback =
    (match: RegExpExecArray, locale: Locale, query: TelegramBot.InlineQuery)
    => Promise<TelegramBot.InlineQueryResult[]> | TelegramBot.InlineQueryResult[]

declare type ButtonCallback = {
    matcher(data: string): boolean
    onClick(
        this: TelegramBot, dataBase: DataBase, getMe: () => TelegramBot.User
    ): BindedButtonCallback
}

declare type ButtonPiece = {
    buttons: ButtonCallback[]
}

declare type FeedbackPiece = {
    matcher(id: string): boolean
    onInlineResult(
        this: TelegramBot, dataBase: DataBase, getMe: () => TelegramBot.User
    ): BindedResultCallback
}

declare type InlineHandler = {
    regexp: RegExp
    onInline(
        this: TelegramBot, dataBase: DataBase, getMe: () => TelegramBot.User
    ): BindedInlineCallback
}
