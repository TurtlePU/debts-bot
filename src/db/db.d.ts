import { UserPiece } from './models/user'
import { OfferPiece } from './models/offer'
import { DebtPiece } from './models/debt'

export * from './models/user'
export * from './models/offer'
export * from './models/debt'

export type DataBase = {
    userPiece: UserPiece
    offerPiece: OfferPiece
    debtPiece: DebtPiece
}
