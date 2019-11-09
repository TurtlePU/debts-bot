import Mongoose from 'mongoose';

export type Offer = {
    from_id: number
    amount: number
    currency: string
}

type OfferDoc = Mongoose.Document & Offer & {
    _id: number
    created: Date
}

const OfferModel = Mongoose.model<OfferDoc>('Offer', new Mongoose.Schema({
    _id: { type: Number, required: true },
    from_id: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    created: { type: Date, expires: 3600, default: Date.now }
}));

export async function createOffer(_id: number, offer: Offer) {
    await new OfferModel({ _id, ...offer }).save();
}

export async function deleteOffer(id: number): Promise<Offer | null> {
    return await OfferModel.findByIdAndDelete(id);
}
