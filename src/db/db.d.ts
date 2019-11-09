import TelegramBot from 'node-telegram-bot-api';

declare type DataBase = {
    connect(): Promise<any>
    getName(user: TelegramBot.User): string
    updateUser(user: TelegramBot.User): Promise<any>
    getDebts(id: number): Promise<OutDebt[]>
}

declare type User = {
    id: number
    name: string
}

declare type OutDebt = {
    to_name: string
    amount: BigInt
}
