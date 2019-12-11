import { matches } from '#/util/StringUtils'
import { isDefined, isInlineKeyboardEvent } from '#/util/TypePredicates'

export type InlineOptions = {
    bot: import('node-telegram-bot-api')
    handlers: Inline.Handler[]
    dataBase: DataBase
    getLocale(code?: string): Locale
    getMe(): import('node-telegram-bot-api').User
}

export default function ConnectInline(
        { bot, handlers, getLocale, dataBase, getMe }: InlineOptions
) {
    const binded = handlers
        .map(({ requestPiece }) => {
            const { regexp, onInline } = requestPiece
            return { regexp, callback: onInline.call(bot, dataBase, getMe) }
        })

    const buttonCallbacks = handlers
        .map(({ keyboard }) => keyboard)
        .filter(isDefined)
        .map(keyboard => 
            keyboard.map(({ key, onClick }) => ({
                key, onClick: onClick.call(bot, dataBase, getMe)
            }))
        )
        .flat()

    const withFeedback = handlers
        .map(({ resultPiece }) => resultPiece)
        .filter(isDefined)
        .map(({ key, onChosenResult }) => ({
            key, onChosenResult: onChosenResult.call(bot, dataBase, getMe)
        }))

    bot.on('inline_query', async query => {
        dataBase.userPiece.updateUser(query.from)
        const pending = binded.map(({ regexp, callback }) => {
            const match = regexp.exec(query.query)
            return match ? callback(match, getLocale(query.from.language_code), query) : []
        })
        const results = (await Promise.all(pending)).flat()
        bot.answerInlineQuery(query.id, results)
    })

    bot.on('chosen_inline_result', result => {
        dataBase.userPiece.updateUser(result.from)
        for (const { key, onChosenResult } of withFeedback) {
            if (matches(key, result.result_id)) {
                onChosenResult(result)
                break
            }
        }
    })

    bot.on('callback_query', async query => {
        if (isInlineKeyboardEvent(query)) {
            dataBase.userPiece.updateUser(query.from)
            if (!query.data) {
                return
            }
            const handler = buttonCallbacks.find(({ key }) => matches(key, query.data))
            if (handler) {
                bot.answerCallbackQuery(query.id,
                    await handler.onClick(query, getLocale(query.from.language_code)))
            }
        }
    })
}
