import Mongoose from 'mongoose';

type Offer = {
    _id: number
    from_id: number
    amount: number
    currency: string
    created: Date
}

type OfferDoc = Mongoose.Document & Offer;

const OfferSchema = new Mongoose.Schema({
    _id: { type: Number, required: true },
    from_id: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    created: { type: Date, expires: 3600, default: Date.now }
});

const OfferModel = Mongoose.model<OfferDoc>('Offer', OfferSchema);

export function createOffer(_id: number, from_id: number, amount: number, currency: string) {
    return new OfferModel({ _id, from_id, amount, currency }).save();
}

export function getOffer(id: number) {
    return OfferModel.findById(id);
}
