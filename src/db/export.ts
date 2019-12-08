import Mongoose from 'mongoose'

import { DataBase } from './db'
export * from './db'

import userPiece from './models/user'
import debtPiece from './models/debt'
import offerPiece from './models/offer'

export default function DB(url: string): { db: DataBase, connect: () => Promise<void> } {
    return {
        db: {
            userPiece,
            debtPiece,
            offerPiece
        },
        async connect() {
            await Mongoose.connect(url, {
                useFindAndModify: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            })
        }
    }
}
