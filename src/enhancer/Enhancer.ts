import {
    isClickEvent,
    isSimpleClick,
    isStrict
} from './Predicates'

/**
 * Injects functionality into supplied bot
 */
export default class Enhancer {
    /**
     * Bot to enhance
     */
    private readonly bot: Enhancer.TelegramBot
    /**
     * List of OnInline listeners identifiable by string key
     */
    private readonly inlineStrictCommands: Enhancer.Inline.StrictCommand[] = []
    /**
     * List of OnInline listeners identifiable by RegExp
     */
    private readonly inlineRegExpCommands: Enhancer.Inline.RegExpCommand[] = []
    /**
     * List of ChosenInlineResult listeners identifiable by string key
     */
    private readonly inlineStrictConsumers: Enhancer.Inline.StrictChoiceConsumer[] = []
    /**
     * List of ChosenInlineResult listeners identifiable by RegExp
     */
    private readonly inlineRegExpConsumers: Enhancer.Inline.RegExpChoiceConsumer[] = []
    /**
     * List of CallbackQuery listeners for buttons below usual messages
     */
    private readonly onClickStrictListeners: Enhancer.OnClickStrict[] = []
    private readonly onClickRegExpListeners: Enhancer.OnClickRegExp[] = []
    /**
     * List of CallbackQuery listeners for buttons below inline messages
     */
    private readonly onInlineClickStrictListeners: Enhancer.Inline.OnClickStrict[] = []
    private readonly onInlineClickRegExpListeners: Enhancer.Inline.OnClickRegExp[] = []

    /**
     * Constructs new Enhancer
     * @param bot bot to enhance
     */
    public constructor(bot: Enhancer.TelegramBot) {
        this.bot = bot
        this.bot.on('inline_query', this.onInlineQuery.bind(this))
        this.bot.on('chosen_inline_result', this.onChosenInlineResult.bind(this))
        this.bot.on('callback_query', this.onCallbackQuery.bind(this))
    }

    /**
     * @param enhancer function to apply to bot being enhanced
     */
    public enhance(enhancer: (this: Enhancer.TelegramBot) => any): this {
        enhancer.call(this.bot)
        return this
    }

    /**
     * @param injector function to utilize Enhancer in its own way
     */
    public inject(injector: (this: Enhancer) => any): this {
        injector.call(this)
        return this
    }

    /**
     * Adds new command to bot
     * @param command command to add
     */
    public command(command: Enhancer.Command): this {
        const { key, callback } = command
        this.bot.onText(key, (msg, match) => {
            if (match == null) {
                throw new Error('Match is empty')
            } else {
                callback.call(this.bot, msg, match)
            }
        })
        return this
    }

    /**
     * Adds new OnInlineQuery listener to bot
     * @param command OnInlineQuery listener to add
     */
    public inlineCommand(command: Enhancer.Inline.Command): this {
        if (isStrict(command)) {
            this.inlineStrictCommands.push(command)
        } else {
            this.inlineRegExpCommands.push(command)
        }
        return this
    }

    /**
     * Adds new ChosenInlineResult listener to bot
     * @param consumer ChosenInlineResult listener to add
     */
    public inlineChoiceConsumer(consumer: Enhancer.Inline.ChoiceConsumer): this {
        if (isStrict(consumer)) {
            this.inlineStrictConsumers.push(consumer)
        } else {
            this.inlineRegExpConsumers.push(consumer)
        }
        return this
    }

    /**
     * Adds new OnClick listener (for buttons below usual messages) to bot
     * @param onClick OnClick listener to add
     */
    public onClick(onClick: Enhancer.OnClickStrict | Enhancer.OnClickRegExp): this {
        if (isStrict(onClick)) {
            this.onClickStrictListeners.push(onClick)
        } else {
            this.onClickRegExpListeners.push(onClick)
        }
        return this
    }

    /**
     * Adds new OnClick listener (for buttons below inline messages) to bot
     * @param onClick OnClick listener to add
     */
    public onInlineClick(
        onClick: Enhancer.Inline.OnClickStrict | Enhancer.Inline.OnClickRegExp
    ): this {
        if (isStrict(onClick)) {
            this.onInlineClickStrictListeners.push(onClick)
        } else {
            this.onInlineClickRegExpListeners.push(onClick)
        }
        return this
    }

    /**
     * Collects `InlineQueryResult`s from listener whose keys fit the query
     * @param query query itself
     */
    private async onInlineQuery(query: Enhancer.Inline.Query) {
        const result = (await Promise.all(
            this.inlineStrictCommands
                .filter(({ key }) => key == query.query)
                .map(({ callback }) => callback.call(this.bot, query))
        )).flat()
        const resultTemp: Enhancer.MaybePromise<Enhancer.Inline.Result[]>[] = []
        for (const { key, callback } of this.inlineRegExpCommands) {
            const exec = key.exec(query.query)
            if (exec) {
                resultTemp.push(callback.call(this.bot, query, exec))
            }
        }
        result.push(...(await Promise.all(resultTemp)).flat())
        this.bot.answerInlineQuery(query.id, result)
    }

    /**
     * Routes ChosenInlineResult to listeners whose keys fit
     * @param result ChosenInlineResult itself
     */
    private onChosenInlineResult(result: Enhancer.Inline.Choice) {
        for (const { key, callback } of this.inlineStrictConsumers) {
            if (key == result.result_id) {
                callback.call(this.bot, result)
            }
        }
        for (const { key, callback } of this.inlineRegExpConsumers) {
            const exec = key.exec(result.result_id)
            if (exec) {
                callback.call(this.bot, result, exec)
            }
        }
    }

    /**
     * Routes CallbackQuery (OnClick) to listeners whose keys fit
     * @param query CallbackQuery itself
     */
    private async onCallbackQuery(query: import('node-telegram-bot-api').CallbackQuery) {
        if (isClickEvent(query)) {
            const strictListeners: Enhancer.OnClickBaseStrict<any>[] = isSimpleClick(query)
                ? this.onClickStrictListeners
                : this.onInlineClickStrictListeners
            const strictResult = await strictListeners.find(
                ({ key }) => key == query.data
            )?.callback.call(this.bot, query)
            if (strictResult) {
                return this.bot.answerCallbackQuery(query.id, strictResult)
            }
            const regExpListeners: Enhancer.OnClickBaseRegExp<any>[] = isSimpleClick(query)
                ? this.onClickRegExpListeners
                : this.onInlineClickRegExpListeners
            for (const listener of regExpListeners) {
                const match = listener.key.exec(query.data)
                if (match) {
                    return this.bot.answerCallbackQuery(query.id,
                        // eslint-disable-next-line no-await-in-loop
                        await listener.callback.call(this.bot, query, match))
                }
            }
        } else {
            throw new Error('No data provided')
        }
    }
}
