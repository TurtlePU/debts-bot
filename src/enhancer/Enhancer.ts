import { matches, isClickEvent, isSimpleClick, isStrict } from './Predicates'

export default class Enhancer {
    public readonly bot: Enhancer.TelegramBot

    private readonly inlineStrictCommands: Enhancer.Inline.StrictCommand[] = []
    private readonly inlineRegExpCommands: Enhancer.Inline.RegExpCommand[] = []

    private readonly inlineStrictConsumers: Enhancer.Inline.StrictChoiceConsumer[] = []
    private readonly inlineRegExpConsumers: Enhancer.Inline.RegExpChoiceConsumer[] = []

    private readonly onClickListeners: Enhancer.OnClick[] = []
    private readonly onInlineClickListeners: Enhancer.Inline.OnClick[] = []

    public constructor(bot: Enhancer.TelegramBot) {
        this.bot = bot
        this.bot.on('inline_query', this.onInlineQuery.bind(this))
        this.bot.on('chosen_inline_result', this.onChosenInlineResult.bind(this))
        this.bot.on('callback_query', this.onCallbackQuery.bind(this))
    }

    public enhance(enhancer: (this: Enhancer.TelegramBot) => any): this {
        enhancer.call(this.bot)
        return this
    }

    public command({ key, callback }: Enhancer.Command): this {
        this.bot.onText(key, (msg, match) => {
            if (match == null) {
                throw new Error('Match is empty')
            } else {
                callback.call(this.bot, msg, match)
            }
        })
        return this
    }

    public inlineCommand(command: Enhancer.Inline.Command): this {
        if (isStrict(command)) {
            this.inlineStrictCommands.push(command)
        } else {
            this.inlineRegExpCommands.push(command)
        }
        return this
    }

    public inlineChoiceConsumer(consumer: Enhancer.Inline.ChoiceConsumer): this {
        if (isStrict(consumer)) {
            this.inlineStrictConsumers.push(consumer)
        } else {
            this.inlineRegExpConsumers.push(consumer)
        }
        return this
    }

    public onClick(onClick: Enhancer.OnClick): this {
        this.onClickListeners.push(onClick)
        return this
    }

    public onInlineClick(onClick: Enhancer.Inline.OnClick): this {
        this.onInlineClickListeners.push(onClick)
        return this
    }

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

    private async onCallbackQuery(query: import('node-telegram-bot-api').CallbackQuery) {
        if (isClickEvent(query)) {
            const listeners: Enhancer.OnClickBase<any>[] = isSimpleClick(query)
                ? this.onClickListeners
                : this.onInlineClickListeners
            const result = await listeners.find(
                ({ key }) => matches(key, query.data)
            )?.callback.call(this.bot, query)
            if (result) {
                this.bot.answerCallbackQuery(query.id, result)
            }
        } else {
            throw new Error('No data provided')
        }
    }
}
