import Mongoose from 'mongoose'

export async function getDebts(id: number)
{
    return []
}

export async function createDebt(from: number, to: number, amount: number, currency: string)
{
    if (from > to) {
        [ from, to, amount ] = [ to, from, -amount ]
    }
    const older = await DebtModel.findOne({ from, to })
    if (!older) {
        new DebtModel({ from, to, amount, currency }).save()
    } else {
        older.amount += amount
        if (older.amount == 0) {
            older.remove()
        } else {
            older.save()
        }
    }
}

type Debt =
{
    from: number
    to: number
    amount: number
    currency: string
}

type DebtDoc = Mongoose.Document & Debt

const DebtModel = Mongoose.model<DebtDoc>('Debt', new Mongoose.Schema({
    from: { type: Number, required: true },
    to: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true }
}))
