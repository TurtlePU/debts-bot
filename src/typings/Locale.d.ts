declare namespace Locale {
    type Debt = DebtInfo & {
        to: string
    }
}

declare type Locale = {
    currency: string
    anon: string
    buttons: {
        accept: string
        reject: string
    }
    hi(name: string): string
    debts(debts: Locale.Debt[]): string
    offerArticle(amount: number, currency: string): {
        title: string
        text: string
    }
    offer: {
        expired: string
        selfAccept: string
        declined(by: string): string
        saved(from: string, to: string, amount: number, currency: string): string
    }
    settleUpArticle: {
        title: string
        text: string
    }
    settleUp(first: string, second: string): string
}
