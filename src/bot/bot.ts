import TelegramBot from 'node-telegram-bot-api';

export default function Bot(token: string, locale: (code: string) => Locale): TelegramBot {
    const bot = new TelegramBot(token);

    // set commands

    return bot;
};
