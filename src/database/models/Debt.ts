import Mongoose from 'mongoose'

const methods: DataBase.Debt.Model = { saveDebt, getDebts, clearDebts }
export default methods

const EndpointSchema = new Mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    is_group: Boolean
}, {
    _id: false
})

const DebtModel = Mongoose.model<DataBase.Debt.Document>('Debt', new Mongoose.Schema({
    from: {
        type: EndpointSchema,
        required: true
    },
    to: {
        type: EndpointSchema,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    }
}))

async function saveDebt(debt: DataBase.Debt.Input) {
    const [ from, to, amount ] =
        less(debt.from, debt.to) ?
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

async function getDebts(endpoint: DataBase.Debt.Endpoint) {
    const result = await Promise.all([
        DebtModel.find({ from: endpoint }),
        DebtModel.find({ to: endpoint })
    ])
    return [
        ...result[0].map(({ to, amount, currency }) => ({ to, amount, currency })),
        ...result[1].map(({ from, amount, currency }) => ({ to: from, amount: -amount, currency }))
    ]
}

async function clearDebts(first: DataBase.Debt.Endpoint, second: DataBase.Debt.Endpoint) {
    const [ from, to ] =
        less(first, second) ? [ first, second ] : [ second, first ]
    await DebtModel.deleteMany({ from, to })
}

function less(
        { is_group: a0, id: b0 }: DataBase.Debt.Endpoint,
        { is_group: a1, id: b1 }: DataBase.Debt.Endpoint
) {
    return a0 != a1 ? !a0 && a1 : b0 < b1
}
