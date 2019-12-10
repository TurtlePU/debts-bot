declare type Offer = {
    from_id: number
    amount: number
    currency: string
}

declare type OfferDoc = import('mongoose').Document & Offer & {
    _id: string
    created: Date
}

declare type OfferPiece = {
    createOffer(id: string, offer: Offer): Promise<OfferDoc>
    getOffer(id: string): PromiseLike<OfferDoc | null>
    deleteOffer(id: string): PromiseLike<OfferDoc | null>
}
