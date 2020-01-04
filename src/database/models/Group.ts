import Mongoose from 'mongoose'

const GroupModel = Mongoose.model<DataBase.Group.Document>('Group', new Mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    here_ids: [ Number ]
}))

const methods: DataBase.Group.Model = {
    async makeOrGetGroup({ id: _id, title }) {
        return await this.getGroup(_id) ?? new GroupModel({ _id, title }).save()
    },
    getGroup: GroupModel.findById.bind(GroupModel)
}

export default methods
