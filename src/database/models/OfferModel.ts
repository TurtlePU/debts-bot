import Mongoose from 'mongoose'

const OfferModel = Mongoose.model<DataBase.Offer.Doc>('Offer', new Mongoose.Schema({
    _id: String,
    from_id: Number,
    type: String,
    debt: {
        type: {
            amount: Number,
            currency: Number
        },
        required(this: DataBase.Offer) {
            return this.type == 'debt'
        }
    },
    created: {
        type: Date,
        expires: 3600,
        default: Date.now
    }
}))

export default {
    createOffer(_id: string, offer: DataBase.Offer) {
        return new OfferModel({ _id, ...offer }).save()
    },
    getOffer: OfferModel.findById.bind(OfferModel),
    deleteOffer: OfferModel.findByIdAndRemove.bind(OfferModel)
}
