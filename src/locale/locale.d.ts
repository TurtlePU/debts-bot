import { OutDebt } from '@db'

declare type Locale = {
    currency: string
    anon: string
    hi(name: string): string
    debts(debts: OutDebt[]): string
    offerArticle(amount: number, currency: string): {
        title: string
        text: string
        button_accept: string
        button_reject: string
    }
    offer: {
        expired: string
        selfAccept: string
        declined(by: string): string
        saved(from: string, to: string, amount: number, currency: string): string
    }
}
