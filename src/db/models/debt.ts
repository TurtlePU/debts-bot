import Mongoose from 'mongoose'
import { shieldMarkdown } from '@util'

export type DebtInfo = {
    amount: number
    currency: string
}

export type InnerDebt = DebtInfo & {
    to: number
}

export type Debt = {
    from: number
    to: number
    amount: number
    currency: string
}

export type DebtDoc = Mongoose.Document & Debt

export type DebtPiece = {
    saveDebt(debt: Debt): Promise<DebtDoc>
    getDebts(id: number): Promise<InnerDebt[]>
    clearDebts(first: number, second: number): Promise<void>
}

const debtPiece: DebtPiece = {
    saveDebt, getDebts, clearDebts
}

export default debtPiece

const DebtModel = Mongoose.model<DebtDoc>('Debt', new Mongoose.Schema({
    from: { type: Number, required: true },
    to: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true }
}))

async function saveDebt(debt: Debt) {
    const [ from, to, amount ] =
        debt.from < debt.to ?
            [ debt.from, debt.to, +debt.amount ] :
            [ debt.to, debt.from, -debt.amount ]
    const currency = shieldMarkdown(debt.currency)
    const older = await DebtModel.findOne({ from, to, currency })
    if (!older) {
        return new DebtModel({ from, to, amount, currency }).save()
    } else {
        older.amount += amount
        if (older.amount == 0) {
            return older.remove()
        } else {
            return older.save()
        }
    }
}

async function getDebts(id: number) {
    const result = await Promise.all([
        DebtModel.find({ from: id }),
        DebtModel.find({ to: id })
    ])
    return [
        ...result[0].map(({ to, amount, currency }) => ({ to, amount, currency })),
        ...result[1].map(({ from, amount, currency }) => ({ to: from, amount: -amount, currency }))
    ]
}

async function clearDebts(first: number, second: number) {
    const [ from, to ] =
        first < second ? [ first, second ] : [ second, first ]
    await DebtModel.deleteMany({ from, to })
}
