import getLocale from '#/locale/Locale'

import inlineKeyboard from '#/util/InlineKeyboard'

import {
    inline_settleup_article_id as id,
    inline_settleup_accept,
    inline_settleup_decline
} from '#/bot/Constants'

/**
 * Prepares settle-up offer inline article
 */
const command: Enhancer.Inline.RegExpCommand = {
    key: /.*/u,
    callback(query) {
        const { articles, buttons } = getLocale(query.from.language_code)
        const { title, text: message_text } = articles.settleUp
        return [ {
            id, type: 'article', title,
            input_message_content: { message_text, parse_mode: 'Markdown' },
            reply_markup: inlineKeyboard([ [
                [ buttons.accept, inline_settleup_accept ],
                [ buttons.reject, inline_settleup_decline ]
            ] ])
        } ]
    }
}

export default command
