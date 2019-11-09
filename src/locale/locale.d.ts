import { OutDebt } from '@db'

declare type Locale = {
    currency: string
    anon(): string
    hi(name: string): string
    debts(debts: OutDebt[]): string
    debtArticle(amount: number, currency: string): {
        title: string
        text: string
        button_text: string
    }
}
