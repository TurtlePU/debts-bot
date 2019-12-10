import { ARTICLE_ID, ACCEPT, DECLINE } from './constants'

const handler: Inline.OnInline = {
    regexp: /.*/u,
    onInline() {
        return (_, locale) => {
            return [ {
                id: ARTICLE_ID,
                type: 'article',
                title: locale.settleUpArticle.title,
                input_message_content: {
                    message_text: locale.settleUpArticle.text,
                    parse_mode: 'Markdown'
                },
                reply_markup: {
                    inline_keyboard: [ [ 
                        { text: locale.buttons.accept, callback_data: ACCEPT },
                        { text: locale.buttons.reject, callback_data: DECLINE }
                    ] ]
                }
            } ]
        }
    }
}

export default handler
