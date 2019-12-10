type QueryResult = import('node-telegram-bot-api').InlineQueryResult
type Query = import('node-telegram-bot-api').InlineQuery

declare namespace Inline {
    type Handler = {
        requestPiece: OnInline
        resultPiece?: OnChosenResult
        keyboard?: OnClick[]
    }
    type OnInline = {
        regexp: RegExp
        onInline: Bound<(match: RegExpExecArray, locale: Locale, query: Query)
        => MaybePromise<QueryResult[]>>
    }
    type OnChosenResult = Identifiable<{
        onChosenResult: Bound<(result: import('node-telegram-bot-api').ChosenInlineResult) => void>
    }>
    type KeyboardEvent = import('node-telegram-bot-api').CallbackQuery & {
        inline_message_id: string
        data: string
        message: undefined
    }
    type KeyboardResponse = Partial<import('node-telegram-bot-api').AnswerCallbackQueryOptions>
    type OnClick = Identifiable<{
        onClick: Bound<(event: KeyboardEvent, locale: Locale)
        => MaybePromise<KeyboardResponse>>
    }>
}
