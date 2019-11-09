import { OutDebt } from '@db'

declare type Locale = {
    currency: string
    anon(): string
    hi(name: string): string
    debts(debts: OutDebt[]): string
    offerArticle(amount: number, currency: string): {
        title: string
        text: string
        button_text: string
    }
    offer: {
        expired: string
        selfAccept: string
        saved(from: string, to: string, amount: number, currency: string): string
    }
}
