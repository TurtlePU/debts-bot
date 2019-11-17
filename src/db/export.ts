import Mongoose from 'mongoose'

import { DataBase } from './db'
export * from './db'

import { updateUser, getName, getNameById } from './models/user'
import { createDebt, getDebts, clearDebts } from './models/debt'
import { createOffer, getOffer, deleteOffer } from './models/offer'

export default function DB(url: string): DataBase {
    return {
        connect,
        getName, getNameById, updateUser,
        createDebt, getDebts, clearDebts,
        createOffer, getOffer, deleteOffer
    }

    async function connect() {
        await Mongoose.connect(url, {
            useFindAndModify: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    }
}
