export default function(
        source: [ string, string ][][]
): import('node-telegram-bot-api').InlineKeyboardMarkup {
    return {
        inline_keyboard: source.map(
            arr => arr.map(
                ([ text, callback_data ]) => ({ text, callback_data })
            )
        )
    }
}
