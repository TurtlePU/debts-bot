import TelegramBot from 'node-telegram-bot-api'

import { InlineHandler, InlineCallbackQuery, ButtonPiece, FeedbackPiece } from '@inline'
import { Locale } from '@locale'
import { DataBase } from '@db'
import { ChosenInlineResult } from './inline/inline_handler'

export type InlineOptions = {
    bot: TelegramBot
    getLocale(code?: string): Locale
    handlers: InlineHandler[]
    dataBase: DataBase
}

export default function ConnectInline({ bot, handlers, getLocale, dataBase }: InlineOptions) {
    const binded = handlers
        .map(({ regexp, onInline }) => {
            return { regexp, callback: onInline.call(bot, dataBase) }
        })

    const buttonCallbacks = handlers
        .filter(hasButtons)
        .map(({ buttons }) => {
            return buttons
                .map(({ matcher, onClick }) => ({ matcher, onClick: onClick.call(bot, dataBase) }))
        })
        .flat()

    const withFeedback = handlers
        .filter(acceptsFeedback)
        .map(({ matcher, onInlineResult }) => {
            return { matcher, callback: onInlineResult.call(bot, dataBase) }
        })

    bot.on('inline_query', onInlineBase)
    bot.on('chosen_inline_result', onInlineResultBase)

    bot.on('callback_query', query => {
        if (isInlineCallbackQuery(query)) {
            onInlineCallbackQueryBase(query)
        }
    })

    async function onInlineBase(query: TelegramBot.InlineQuery) {
        dataBase.updateUser(query.from)
        const pending = binded.map(({ regexp, callback }) => {
            const match = regexp.exec(query.query)
            return match ? callback(match, getLocale(query.from.language_code), query) : []
        })
        const results = (await Promise.all(pending)).flat()
        bot.answerInlineQuery(query.id, results)
    }

    function onInlineResultBase(result: TelegramBot.ChosenInlineResult) {
        dataBase.updateUser(result.from)
        if (!hasId(result)) {
            return
        }
        for (const { matcher, callback } of withFeedback) {
            if (matcher(result.inline_message_id)) {
                callback(result)
                break
            }
        }
    }

    async function onInlineCallbackQueryBase(query: InlineCallbackQuery) {
        dataBase.updateUser(query.from)
        if (!query.data) {
            return
        }
        const handler = buttonCallbacks.find(({ matcher }) => matcher(query.data))
        if (handler) {
            bot.answerCallbackQuery(query.id,
                await handler.onClick(query, getLocale(query.from.language_code)))
        }
    }
}

function isInlineCallbackQuery(query: TelegramBot.CallbackQuery): query is InlineCallbackQuery {
    return !!query.inline_message_id
}

function hasButtons(handler: InlineHandler): handler is InlineHandler & ButtonPiece {
    return !!(handler as InlineHandler & ButtonPiece).buttons
}

function acceptsFeedback(handler: InlineHandler): handler is InlineHandler & FeedbackPiece {
    return !!(handler as InlineHandler & FeedbackPiece).onInlineResult
}

function hasId(result: TelegramBot.ChosenInlineResult): result is ChosenInlineResult {
    return !!result.inline_message_id
}
