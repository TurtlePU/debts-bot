declare namespace DataBase {
    type Debt = Debt.Value & {
        from: number
    }
    namespace Debt {
        type Info = {
            amount: number
            currency: string
        }
        type Value = Info & {
            to: number
        }
        type Doc = import('mongoose').Document & Debt
        type Piece = {
            saveDebt(debt: Debt): Promise<Doc>
            getDebts(id: number): Promise<Value[]>
            clearDebts(first: number, second: number): Promise<void>
        }
    }
}
