declare namespace Enhancer {
    namespace Inline {
        type Query = import('node-telegram-bot-api').InlineQuery
        type Result = import('node-telegram-bot-api').InlineQueryResult
        type Choice = import('node-telegram-bot-api').ChosenInlineResult

        type Strict<T extends any[], U> = UniqueCallback<string, T, U>

        type StrictCommand = Strict<[Query], Result[] | Promise<Result[]>>
        type RegExpCommand =
            UniqueCallback<RegExp, [Query, RegExpExecArray], Result[] | Promise<Result[]>>
        type Command = StrictCommand | RegExpCommand

        type StrictChoiceConsumer = Strict<[Choice], any>
        type RegExpChoiceConsumer = UniqueCallback<RegExp, [Choice, RegExpExecArray], any>
        type ChoiceConsumer = StrictChoiceConsumer | RegExpChoiceConsumer

        type Click = ClickEventBase & {
            message: never
            inline_message_id: NonNullable<ClickEventBase['inline_message_id']>
        }
        type OnClick = OnClickBase<Click>
    }
}
