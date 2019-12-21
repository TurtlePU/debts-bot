import Mongoose from 'mongoose'

export default { saveDebt, getDebts, clearDebts }

const DebtModel = Mongoose.model<DataBase.Debt.Doc>('Debt', new Mongoose.Schema({
    from: { type: Number, required: true },
    to: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true }
}))

async function saveDebt(debt: DataBase.Debt) {
    const [ from, to, amount ] =
        debt.from < debt.to ?
            [ debt.from, debt.to, +debt.amount ] :
            [ debt.to, debt.from, -debt.amount ]
    const currency = debt.currency
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
