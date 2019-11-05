import TelegramBot from 'node-telegram-bot-api';

export default {
    regexp: /.*/,
    onInline(this: TelegramBot, query: TelegramBot.InlineQuery, match: RegExpExecArray) {
        //
    }
}