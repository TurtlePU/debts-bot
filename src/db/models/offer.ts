import Mongoose from 'mongoose'

export type Offer = {
    from_id: number
    amount: number
    currency: string
}

type OfferDoc = Mongoose.Document & Offer & {
    _id: string
    created: Date
}

const OfferModel = Mongoose.model<OfferDoc>('Offer', new Mongoose.Schema({
    _id: { type: String, required: true },
    from_id: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    created: { type: Date, expires: 3600, default: Date.now }
}))

export async function createOffer(_id: string, offer: Offer) {
    const { from_id, amount, currency } = offer
    await new OfferModel({ _id, from_id, amount, currency }).save()
}

export async function deleteOffer(id: string): Promise<Offer | null> {
    return await OfferModel.findByIdAndRemove(id)
}
