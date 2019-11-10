import TelegramBot from 'node-telegram-bot-api'

import { InlineHandler, InlineCallbackQuery, CallbackPiece, FeedbackPiece } from '@inline'
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

    const withButtons = handlers
        .filter(hasButtons)
        .map(({ id, onInlineCallbackQuery }) => {
            return { id, callback: onInlineCallbackQuery.call(bot, dataBase) }
        })

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
        for (const { id, callback } of withButtons) {
            if (query.data.startsWith(id)) {
                bot.answerCallbackQuery(query.id,
                    // eslint-disable-next-line no-await-in-loop
                    await callback(query, getLocale(query.from.language_code)))
                break
            }
        }
    }
}

function isInlineCallbackQuery(query: TelegramBot.CallbackQuery): query is InlineCallbackQuery {
    return !!query.inline_message_id
}

function hasButtons(handler: InlineHandler): handler is InlineHandler & CallbackPiece {
    return !!(handler as InlineHandler & CallbackPiece).id
}

function acceptsFeedback(handler: InlineHandler): handler is InlineHandler & FeedbackPiece {
    return !!(handler as InlineHandler & FeedbackPiece).onInlineResult
}
