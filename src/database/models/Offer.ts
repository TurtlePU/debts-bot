import Mongoose from 'mongoose'

const GroupSchema = new Mongoose.Schema({
    payer_ids: [ Number ],
    member_ids: [ Number ]
})

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
    group: {
        type: GroupSchema,
        required(this: DataBase.Offer.InDataBase) {
            return this.type == 'group'
        }
    },
    created: {
        type: Date,
        expires: 3600,
        default: Date.now
    }
}))

const methods: DataBase.Offer.Model = {
    createOffer,
    getOffer: OfferModel.findById.bind(OfferModel),
    deleteOffer: OfferModel.findByIdAndRemove.bind(OfferModel)
}

function createOffer(_id: string, offer: DataBase.Offer.InputType) {
    return new OfferModel({ _id, ...offer }).save()
}

export default methods
