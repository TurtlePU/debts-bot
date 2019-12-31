declare namespace Enhancer {
    /**
     * TelegramBot type from `node-telegram-bot-api`
     */
    type TelegramBot = import('node-telegram-bot-api')
    /**
     * Plain Telegram user
     */
    type User = import('node-telegram-bot-api').User
    /**
     * Plain Telegram message
     */
    type Message = import('node-telegram-bot-api').Message
    /**
     * Callback query (button click event)
     */
    type CallbackQuery = import('node-telegram-bot-api').CallbackQuery
    /**
     * Response to Callback Query, a.k.a Answer Callback Query Options
     */
    type ClickResult = Partial<import('node-telegram-bot-api').AnswerCallbackQueryOptions>

    /**
     * Something that can be awaited to result in `T`
     */
    type MaybePromise<T> = T | Promise<T>
    /**
     * Base type for listeners used with enhancer --- ones that can be identified by `key`
     */
    type UniqueCallback<Key, CallbackArguments extends Array<any>, CallbackReturn> = {
        key: Key
        callback(this: TelegramBot, ...args: CallbackArguments): CallbackReturn
    }
    /**
     * Listener identifiable with string key
     */
    type Strict<T extends any[], U> = UniqueCallback<string, T, U>

    /**
     * Base type for On-Button-Click events. Just Callback Query with non-optional data
     */
    type ClickEventBase = CallbackQuery & { data: NonNullable<CallbackQuery['data']> }
    /**
     * Base type for On-Button-Click listeners
     */
    type OnClickBaseStrict<ClickEvent> = Strict<[ClickEvent], MaybePromise<ClickResult>>
    type OnClickBaseRegExp<ClickEvent> =
        UniqueCallback<RegExp, [ClickEvent, RegExpExecArray], MaybePromise<ClickResult>>

    /**
     * On-Text-Listener, a.k.a bot command
     */
    type Command = UniqueCallback<RegExp, [Message, RegExpExecArray], MaybePromise<any>>

    /**
     * On-Button-Click-Event, specific for buttons below usual messages
     */
    type ClickEvent = ClickEventBase & {
        inline_message_id: never
        message: NonNullable<ClickEventBase['message']>
    }
    /**
     * On-Button-Click-Listener, specific for buttons below usual messages
     */
    type OnClickStrict = OnClickBaseStrict<ClickEvent>
    type OnClickRegExp = OnClickBaseRegExp<ClickEvent>
    type OnClick = OnClickStrict | OnClickRegExp
}
