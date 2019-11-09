import Mongoose from 'mongoose'

export async function getDebts(id: number) {
    return []
}

type Debt = {
    from_id: number
    to_id: number
    amount: number
    currency: string
}

type DebtDoc = Mongoose.Document & Debt

const DebtModel = Mongoose.model<DebtDoc>('Debt', new Mongoose.Schema({
    from_id: { type: Number, required: true },
    to_id: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true }
}))
