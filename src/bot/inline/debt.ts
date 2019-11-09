import TelegramBot from 'node-telegram-bot-api'

import { InlineHandler, CallbackPiece, FeedbackPiece } from './inline_handler'
import { Locale } from '@locale'

const id = 'debt'

const handler: InlineHandler & CallbackPiece & FeedbackPiece = {
    id,
    regexp: /^(-?\d{1,9})\s*([^\s\d])?$/,
    onInline() {
        return async (match, locale) => {
            const amount = +match[1]
            const currency = match[2] || locale.currency
            return [ amount, -amount ].map(amount => offerArticle(locale, amount, currency))
        }
    },
    onInlineResult(dataBase) {
        return result => {
            if (!result.inline_message_id) {
                throw new Error('Debt article message_id is missing')
            }
            const match = /^(-?\d+)([^\d])$/.exec(result.result_id)
            if (!match) {
                throw new Error('Debt article id is in wrong format')
            }
            const amount = +match[1]
            const currency = match[2]
            dataBase.createOffer(result.inline_message_id, {
                from_id: result.from.id,
                amount, currency
            })
        }
    },
    onInlineCallbackQuery(dataBase) {
        return async (query, locale) => {
            const offer = await dataBase.deleteOffer(query.inline_message_id)
            if (!offer) {
                this.editMessageText(locale.offer.expired)
                return { text: locale.offer.expired }
            } else if (query.from.id == offer.from_id) {
                return { text: '' }
            } else {
                dataBase.createDebt(offer.from_id, query.from.id, offer.amount, offer.currency)
                const text = locale.offer.saved(
                    await dataBase.getNameById(offer.from_id), dataBase.getName(query.from),
                    offer.amount, offer.currency)
                this.editMessageText(text)
                return { text }
            }
        }
    }
}

export default handler

function offerArticle(locale: Locale, amount: number, currency: string
        ): TelegramBot.InlineQueryResultArticle {
    const article = locale.offerArticle(amount, currency)
    return {
        id: amount + currency,
        type: 'article',
        title: article.title,
        input_message_content: {
            message_text: article.text,
            parse_mode: 'Markdown'
        },
        reply_markup: {
            inline_keyboard: [[ { text: article.button_text, callback_data: id } ]]
        }
    }
}
