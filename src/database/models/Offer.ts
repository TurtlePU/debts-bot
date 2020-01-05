import Mongoose from 'mongoose'

const GroupSchema = new Mongoose.Schema({
    payer_ids: [ Number ],
    member_ids: [ Number ]
}, {
    _id: false
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
        required(this: DataBase.Offer.Document) {
            return this.type == 'debt'
        }
    },
    group: {
        type: GroupSchema,
        required(this: DataBase.Offer.Document) {
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
    createOffer(type, { id: _id, ...tail }) {
        return new OfferModel({ _id, type, ...tail }).save() as any
    },
    getOffer: OfferModel.findById.bind(OfferModel),
    deleteOffer: OfferModel.findByIdAndRemove.bind(OfferModel)
}

export default methods
