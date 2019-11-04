import TelegramBot from 'node-telegram-bot-api';

declare type DataBase = {
    name: (id: number) => Promise<string>
    updateUser: (user: TelegramBot.User) => Promise<void>
    debts: (id: number) => Promise<OutDebt[]>
}

declare type User = {
    id: number;
    name: string;
}

declare type OutDebt = {
    to: User;
    amount: BigInt;
}
