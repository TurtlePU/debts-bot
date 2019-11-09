import TelegramBot from 'node-telegram-bot-api'
import { Offer } from './models/offer'

declare type DataBase = {
    connect(): Promise<void>
    getNameById(id: number): Promise<string>
    getName(user: TelegramBot.User): string
    updateUser(user: TelegramBot.User): Promise<void>
    getDebts(id: number): Promise<OutDebt[]>
    createOffer(id: string, offer: Offer): Promise<void>
    deleteOffer(id: string): Promise<Offer | null>
}

declare type User = {
    id: number
    name: string
}

declare type OutDebt = {
    to_name: string
    amount: BigInt
}
