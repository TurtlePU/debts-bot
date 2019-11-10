import TelegramBot from 'node-telegram-bot-api'

import { InlineHandler, InlineCallbackQuery, ButtonPiece, FeedbackPiece } from '@inline'
import { Locale } from '@locale'
import { DataBase } from '@db'

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
        .map(({ regexp, onInlineResult }) => {
            return { regexp, callback: onInlineResult.call(bot, dataBase) }
        })

    bot.on('inline_query', onInlineBase)
    bot.on('chosen_inline_result', onInlineResultBase)

    bot.on('callback_query', query => {
        if (isInlineCallbackQuery(query)) {
            onInlineCallbackQueryBase(query)
        }
    })

    async function onInlineBase(query: TelegramBot.InlineQuery) {
        const pending = binded.map(({ regexp, callback }) => {
            const match = regexp.exec(query.query)
            return match ? callback(match, getLocale(query.from.language_code), query) : []
        })
        const results = (await Promise.all(pending)).flat()
        bot.answerInlineQuery(query.id, results)
    }

    function onInlineResultBase(result: TelegramBot.ChosenInlineResult) {
        for (const { regexp, callback } of withFeedback) {
            if (regexp.exec(result.query)) {
                callback(result)
                break
            }
        }
    }

    async function onInlineCallbackQueryBase(query: InlineCallbackQuery) {
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
