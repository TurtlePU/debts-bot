import TelegramBot from 'node-telegram-bot-api';

import { InlineHandler, CallbackPiece, FeedbackPiece } from './inline_handler';
import { Locale } from '@locale';

const id = 'debt';

const handler: InlineHandler & CallbackPiece & FeedbackPiece = {
    id,
    regexp: /^(-?\d{1,9})\s*([^\s\d])?$/,
    onInline(locale) {
        return async (_, match) => {
            const amount = +match[1];
            const currency = match[2] || locale.currency;
            return [ amount, -amount ].map(amount => debtArticle(locale, amount, currency));
        }
    },
    onInlineResult(dataBase) {
        return result => {
            if (!result.inline_message_id) {
                throw new Error('Debt article message_id is missing');
            }
            const match = /^(-?\d+)([^\d])$/.exec(result.result_id);
            if (!match) {
                throw new Error('Debt article id is in wrong format');
            }
            const amount = +match[1];
            const currency = match[2];
            dataBase.createOffer(result.inline_message_id, {
                from_id: result.from.id,
                amount, currency
            });
        }
    },
    onInlineCallbackQuery(query) {
        //
    }
};

export default handler;

function debtArticle(locale: Locale, amount: number, currency: string
        ): TelegramBot.InlineQueryResultArticle {
    const article = locale.debtArticle(amount, currency);
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
    };
}
