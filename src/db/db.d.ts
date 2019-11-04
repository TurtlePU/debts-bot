import TelegramBot from 'node-telegram-bot-api';

declare type DataBase = {
    name: (id: number) => Promise<string>
    updateUser: (user: TelegramBot.User) => Promise<void>
}
