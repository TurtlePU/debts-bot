import Mongoose from 'mongoose'
import { Decimal128 } from 'bson';

export async function getDebts(id: number) {
    return [];
}

type Debt = {
    from_id: number
    to_id: number
    amount: Decimal128
    currency: string
}

type DebtDoc = Mongoose.Document & Debt;

const DebtModel = Mongoose.model<DebtDoc>('Debt', new Mongoose.Schema({
    from_id: { type: Number, required: true },
    to_id: { type: Number, required: true },
    amount: { type: Decimal128, required: true },
    currency: { type: String, required: true }
}));
