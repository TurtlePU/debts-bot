declare type DebtInfo = {
    amount: number
    currency: string
}
declare type InnerDebt = DebtInfo & { to: number }
declare type Debt = InnerDebt & { from: number }

declare type DebtDoc = import('mongoose').Document & Debt

declare type DebtPiece = {
    saveDebt(debt: Debt): Promise<DebtDoc>
    getDebts(id: number): Promise<InnerDebt[]>
    clearDebts(first: number, second: number): Promise<void>
}
