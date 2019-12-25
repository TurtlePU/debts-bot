import Mongoose from 'mongoose'

const GroupModel = Mongoose.model<DataBase.Group.Document>('Group', new Mongoose.Schema({
    _id: Number,
    here_ids: [ Number ],
    balances: {
        type: Map,
        required: true,
        of: {
            type: Map,
            of: Number
        }
    }
}))

const methods: DataBase.Group.Model = {
    async makeOrGetGroup(_id) {
        return await this.getGroup(_id) ?? new GroupModel({ _id, balances: {} }).save()
    },
    getGroup: GroupModel.findById.bind(GroupModel)
}

export default methods
