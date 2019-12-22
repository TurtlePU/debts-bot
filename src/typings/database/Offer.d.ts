declare namespace DataBase {
    type Offer = Offer.DebtType | Offer.Base<'settleup'>
    namespace Offer {
        type Base<T> = {
            from_id: number
            type: T
        }
        type DebtPart = {
            debt: {
                amount: number
                currency: string
            }
        }
        type DebtType = Base<'debt'> & DebtPart
        type InDataBase = Base<'debt' | 'settleup'> & Partial<DebtPart>
        type Document = DataBase.Document & InDataBase & {
            _id: string
            created: Date
        }
        type Model = {
            createOffer(id: string, offer: Offer): Promise<Document>
            getOffer(id: string): DocumentQuery<Document | null, Document>
            deleteOffer(id: string): DocumentQuery<Document | null, Document>
        }
    }
}
