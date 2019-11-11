import Mongoose from 'mongoose'
import { OutDebt } from '@db'
import { getNameById } from './user'

export async function getDebts(id: number): Promise<OutDebt[]> {
    const result = await Promise.all([
        DebtModel.find({ from: id }),
        DebtModel.find({ to: id })
    ])
    const debts = [
        ...result[0].map(({ to, amount, currency }) => ({ to, amount, currency })),
        ...result[1].map(({ from, amount, currency }) => ({ to: from, amount: -amount, currency }))
    ]
    return Promise.all(debts.map(async ({ to, ...tail }) => ({
        to_name: await getNameById(to), ...tail
    })))
}

export async function createDebt(from_id: number, to_id: number, amnt: number, currency: string) {
    const [ from, to, amount ] =
        from_id < to_id ?
            [ from_id, to_id, +amnt ] :
            [ to_id, from_id, -amnt ]
    const older = await DebtModel.findOne({ from, to, currency })
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

export async function clearDebts(first_id: number, second_id: number) {
    const [ from, to ] =
        first_id < second_id ? [ first_id, second_id ] : [ second_id, first_id ]
    await DebtModel.deleteMany({ from, to })
}

type Debt = {
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
