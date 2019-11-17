import TelegramBot from 'node-telegram-bot-api'
import { Offer, OfferDoc } from './models/offer'

declare type DataBase = {
    connect(): Promise<void>
    getNameById(id: number): Promise<string>
    getName(user: TelegramBot.User): string
    updateUser(user: TelegramBot.User): Promise<void>
    createOffer(id: string, offer: Offer): Promise<void>
    getOffer(id: string): Promise<OfferDoc | null>
    deleteOffer(id: string): Promise<Offer | null>
    createDebt(from: number, to: number, amount: number, currency: string): Promise<void>
    getDebts(id: number): Promise<OutDebt[]>
    clearDebts(first_id: number, second_id: number): Promise<void>
}

declare type OutDebt = {
    to_name: string
    amount: number
    currency: string
}
