import Mongoose from 'mongoose'

import userPiece from './models/UserModel'
import debtPiece from './models/DebtModel'
import offerPiece from './models/OfferModel'

export default {
    userPiece,
    debtPiece,
    offerPiece
}

export function connect(url: string) {
    return Mongoose.connect(url, {
        useFindAndModify: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
}
