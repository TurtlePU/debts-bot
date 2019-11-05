import TelegramBot from 'node-telegram-bot-api';

export default {
    regexp: /-?\d+/,
    onInline(this: TelegramBot, query: TelegramBot.InlineQuery, match: RegExpExecArray) {
        const amount = BigInt(match[0]);
        //
    },
    onInlineResult(this: TelegramBot, result: TelegramBot.ChosenInlineResult) {
        //
    }
}
