import Mongoose from 'mongoose'

export type Offer =
{
    from_id: number
    amount: number
    currency: string
}

type DocExtensions =
{
    _id: string
    created: Date
}

type OfferDoc = Mongoose.Document & Offer & DocExtensions

const OfferModel = Mongoose.model<OfferDoc>('Offer', new Mongoose.Schema({
    _id: { type: String, required: true },
    from_id: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    created: { type: Date, expires: 3600, default: Date.now }
}))

export async function createOffer(_id: string, offer: Offer)
{
    await new OfferModel({ _id, ...offer }).save()
}

export async function deleteOffer(id: string): Promise<Offer | null>
{
    return await OfferModel.findByIdAndDelete(id)
}
