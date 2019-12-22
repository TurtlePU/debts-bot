declare namespace Enhancer {
    namespace Inline {
        /**
         * On-Inline event, inline query
         */
        type Query = import('node-telegram-bot-api').InlineQuery
        /**
         * Response to inline query
         */
        type Result = import('node-telegram-bot-api').InlineQueryResult
        /**
         * On-Chosen-Inline-Result event
         */
        type Choice = import('node-telegram-bot-api').ChosenInlineResult

        /**
         * Listener identifiable with string key
         */
        type Strict<T extends any[], U> = UniqueCallback<string, T, U>

        /**
         * On-Inline listener, identifiable with string key
         */
        type StrictCommand = Strict<[Query], Result[] | Promise<Result[]>>
        /**
         * On-Inline listener, identifiable with regexp
         */
        type RegExpCommand =
            UniqueCallback<RegExp, [Query, RegExpExecArray], Result[] | Promise<Result[]>>
        /**
         * On-Inline listener
         */
        type Command = StrictCommand | RegExpCommand

        /**
         * On-Chosen-Inline-Result listener, identifiable with string key
         */
        type StrictChoiceConsumer = Strict<[Choice], any>
        /**
         * On-Chosen-Inline-Result listener, identifiable with regexp
         */
        type RegExpChoiceConsumer = UniqueCallback<RegExp, [Choice, RegExpExecArray], any>
        /**
         * On-Chosen-Inline-Result listener
         */
        type ChoiceConsumer = StrictChoiceConsumer | RegExpChoiceConsumer

        /**
         * On-Button-Click event specific for buttons below inline messages
         */
        type Click = ClickEventBase & {
            message: never
            inline_message_id: NonNullable<ClickEventBase['inline_message_id']>
        }
        /**
         * On-Button-Click listener specific for buttons below inline messages
         */
        type OnClick = OnClickBase<Click>
    }
}
