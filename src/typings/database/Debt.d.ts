declare namespace DataBase {
    type Debt = Debt.InDataBase & { from: number }
    namespace Debt {
        type Info = {
            amount: number
            currency: string
        }
        type InDataBase = Info & { to: number }
        type Document = DataBase.Document & Debt
        type Model = {
            saveDebt(debt: Debt): Promise<Document>
            getDebts(id: number): Promise<InDataBase[]>
            clearDebts(first: number, second: number): Promise<void>
        }
    }
}
