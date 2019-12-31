import getLocale from '#/locale/Locale'

import {
    inline_settleup_article_id,
    inline_settleup_accept,
    inline_settleup_decline
} from '#/bot/Constants'

/**
 * Prepares settle-up offer inline article
 */
const command: Enhancer.Inline.RegExpCommand = {
    key: /.*/u,
    callback(query) {
        const locale = getLocale(query.from.language_code)
        return [ {
            id: inline_settleup_article_id,
            type: 'article',
            title: locale.articles.settleUp.title,
            input_message_content: {
                message_text: locale.articles.settleUp.text,
                parse_mode: 'Markdown'
            },
            reply_markup: {
                inline_keyboard: [ [ 
                    { text: locale.buttons.accept, callback_data: inline_settleup_accept },
                    { text: locale.buttons.reject, callback_data: inline_settleup_decline }
                ] ]
            }
        } ]
    }
}

export default command
