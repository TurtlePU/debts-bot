import Mongoose from 'mongoose'

const OfferModel = Mongoose.model<DataBase.Offer.Document>('Offer', new Mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    from_id: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    debt: {
        type: {
            amount: {
                type: Number,
                required: true
            },
            currency: {
                type: Number,
                required: true
            }
        },
        required(this: DataBase.Offer.InDataBase) {
            return this.type == 'debt'
        }
    },
    created: {
        type: Date,
        expires: 3600,
        default: Date.now
    }
}))

const methods: DataBase.Offer.Model = {
    createOffer(_id: string, offer: DataBase.Offer) {
        return new OfferModel({ _id, ...offer }).save()
    },
    getOffer: OfferModel.findById.bind(OfferModel),
    deleteOffer: OfferModel.findByIdAndRemove.bind(OfferModel)
}

export default methods
