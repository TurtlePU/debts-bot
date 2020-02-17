import Mongoose from 'mongoose'

const methods: DataBase.Debt.Model = {
    saveGroupDebt, saveDebt, getDebts, clearDebts, clearGroupDebts
}
export default methods

const EndpointSchema = new Mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    is_group: {
        type: Boolean,
        required: true
    }
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

async function saveGroupDebt(
        group_id: number, from: number[], to: number[], { amount, currency }: DataBase.Debt.Info
) {
    const entries = mergeEntries(getEntries(from, amount).concat(getEntries(to, -amount)))
    await Promise.all(entries.map(([ id, delta ]) =>
        saveDebt({
            amount: delta,
            currency,
            from: { id, is_group: false },
            to: { id: group_id, is_group: true }
        })
    ))
    return entries
}

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

async function clearGroupDebts(group_id: number) {
    let endpoint: DataBase.Debt.Endpoint = {
        id: group_id,
        is_group: true
    }
    await Promise.all([
        DebtModel.deleteMany({ from: endpoint }),
        DebtModel.deleteMany({ to: endpoint })
    ])
}

const { abs, floor, sign } = Math
const PRECISION = 100

function getAddend(amount: number, size: number) {
    return sign(amount) * floor(abs(amount) / size * PRECISION) / PRECISION
}

function getLeftover(amount: number, size: number) {
    return amount - getAddend(amount, size) * size
}

function getEntries(ids: number[], amount: number): [number, number][] {
    const addend = getAddend(amount, ids.length)
    const leftover = getLeftover(amount, ids.length)
    return ids.map((id, i) => [ id, i == 0 ? addend + leftover : addend ])
}

function mergeEntries(entries: [number, number][]) {
    const deltaMap = new Map<number, number>()
    for (const [ id, addend ] of entries) {
        const delta = deltaMap.get(id) ?? 0
        deltaMap.set(id, delta + addend)
    }
    for (const [ key, value ] of deltaMap) {
        if (value == 0) {
            deltaMap.delete(key)
        }
    }
    return [ ...deltaMap.entries() ]
}
