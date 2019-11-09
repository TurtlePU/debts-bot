import Mongoose from 'mongoose'

import { DataBase } from './db'
export * from './db'

import { updateUser, getName, getNameById } from './models/user'
import { createDebt, getDebts } from './models/debt'
import { createOffer, deleteOffer } from './models/offer'

export default function DB(url: string): DataBase {
    return { connect, getName, getNameById, updateUser, createDebt, getDebts, createOffer, deleteOffer }

    async function connect() {
        await Mongoose.connect(url)
    }
}
