declare namespace DataBase {    
    type Offer = {
        from_id: number
        amount: number
        currency: string
    }
    namespace Offer {
        type Doc = import('mongoose').Document & Offer & {
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
