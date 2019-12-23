import Mongoose from 'mongoose'

const GroupModel = Mongoose.model<DataBase.Group.Document>('Group', new Mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    message_id: {
        type: Number,
        required: true
    },
    locale_code: String,
    member_ids: [ Number ]
}))

const methods: DataBase.Group.Model = {
    makeGroup(_id, message_id, locale_code) {
        return new GroupModel({ _id, message_id, locale_code }).save()
    },
    getGroup: GroupModel.findById.bind(GroupModel)
}

export default methods
