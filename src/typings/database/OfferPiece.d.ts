declare namespace DataBase {
    type OfferBase<T> = {
        from_id: number
        type: T
    }
    type DebtPart = {
        debt: {
            amount: number
            currency: string
        }
    }
    type DebtOffer = OfferBase<'debt'> & DebtPart
    type Offer = DebtOffer | OfferBase<'settleup'>
    type SavedOffer = OfferBase<'debt' | 'settleup'> & Partial<DebtPart>
    namespace Offer {
        type Doc = import('mongoose').Document & SavedOffer & {
            _id: string
            created: Date
        }
        type Piece = {
            createOffer(id: string, offer: Offer): Promise<Doc>
            getOffer(id: string): PromiseLike<Doc | null>
            deleteOffer(id: string): PromiseLike<Doc | null>
        }
    }
}
