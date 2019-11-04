import TelegramBot from 'node-telegram-bot-api';

export default function Bot(token: string): TelegramBot {
    const bot = new TelegramBot(token);

    // set commands

    return bot;
}
