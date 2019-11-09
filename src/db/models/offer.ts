import Mongoose from 'mongoose';
import { Decimal128 } from 'bson';

type Offer = {
    from_id: number
    amount: Decimal128
    currency: string
    created: Date
}

type OfferDoc = Mongoose.Document & Offer;

const OfferSchema = new Mongoose.Schema({
    from_id: { type: Number, required: true },
    amount: { type: Decimal128, required: true },
    currency: { type: String, required: true },
    created: { type: Date, expires: 3600, default: Date.now }
});

const OfferModel = Mongoose.model<OfferDoc>('Offer', OfferSchema);

export function createOffer(from_id: number, amount: Decimal128, currency: string) {
    return new OfferModel({ from_id, amount, currency }).save();
}
