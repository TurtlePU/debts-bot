import Mongoose from 'mongoose'

import userPiece from './models/UserModel'
import debtPiece from './models/DebtModel'
import offerPiece from './models/OfferModel'

export default function DataBase(url: string): { db: DataBase, connect: () => Promise<void> } {
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
