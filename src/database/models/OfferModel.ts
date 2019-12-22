import Mongoose from 'mongoose'

const OfferModel = Mongoose.model<DataBase.Offer.Doc>('Offer', new Mongoose.Schema({
    _id: { type: String, required: true },
    from_id: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    created: { type: Date, expires: 3600, default: Date.now }
}))

export default {
    createOffer(_id: string, offer: DataBase.Offer) {
        const { from_id, amount, currency } = offer
        return new OfferModel({ _id, from_id, amount, currency }).save()
    },
    getOffer: OfferModel.findById.bind(OfferModel),
    deleteOffer: OfferModel.findByIdAndRemove.bind(OfferModel)
}
