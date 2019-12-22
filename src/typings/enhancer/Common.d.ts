declare namespace Enhancer {
    type TelegramBot = import('node-telegram-bot-api')
    type Message = import('node-telegram-bot-api').Message
    type CallbackQuery = import('node-telegram-bot-api').CallbackQuery
    type ClickResult = Partial<import('node-telegram-bot-api').AnswerCallbackQueryOptions>

    type MaybePromise<T> = T | Promise<T>
    type UniqueCallback<Key, CallbackArguments extends Array<any>, CallbackReturn> = {
        key: Key
        callback(this: TelegramBot, ...args: CallbackArguments): CallbackReturn
    }

    type ClickEventBase = CallbackQuery & { data: string }
    type OnClickBase<ClickEvent> =
        UniqueCallback<string | RegExp, [ClickEvent], MaybePromise<ClickResult>>

    type Command = UniqueCallback<RegExp, [Message, RegExpExecArray], MaybePromise<any>>

    type ClickEvent = ClickEventBase & {
        inline_message_id: never
        message: NonNullable<ClickEventBase['message']>
    }
    type OnClick = OnClickBase<ClickEvent>
}
