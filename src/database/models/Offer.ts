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
    group: {
        type: {
            payer_ids: [ Number ],
            member_ids: [ Number ]
        },
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
    createGroupOffer: (id, offer) => createOffer(`group:${id}`, offer),
    createInlineOffer: (id, offer) => createOffer(`inline:${id}`, offer),
    getOffer: OfferModel.findById.bind(OfferModel),
    deleteOffer: OfferModel.findByIdAndRemove.bind(OfferModel)
}

function createOffer(_id: string, offer: DataBase.Offer.InputType) {
    if (offer.type == 'group') {
        return new OfferModel({
            _id,
            group: {},
            ...offer
        }).save()
    } else {
        return new OfferModel({
            _id, ...offer
        }).save()
    }
}

export default methods
