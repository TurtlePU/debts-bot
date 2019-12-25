import Mongoose from 'mongoose'

const GroupModel = Mongoose.model<DataBase.Group.Document>('Group', new Mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    here_ids: [ Number ],
    balances: {
        type: Map,
        of: {
            type: Map,
            of: Number
        },
        default: () => new Mongoose.Types.Map()
    }
}))

const methods: DataBase.Group.Model = {
    async makeOrGetGroup(_id) {
        return await this.getGroup(_id) ?? new GroupModel({ _id }).save()
    },
    getGroup: GroupModel.findById.bind(GroupModel)
}

export default methods
