import Mongoose from 'mongoose'

const GroupModel = Mongoose.model<DataBase.Group.Document>('Group', new Mongoose.Schema({
    _id: Number,
    members: {
        type: Map,
        of: {
            type: Map,
            of: Number
        }
    }
}))

const methods: DataBase.Group.Model = {
    async makeOrGetGroup(_id) {
        return await this.getGroup(_id) ?? new GroupModel({ _id }).save()
    },
    getGroup: GroupModel.findById.bind(GroupModel),
    addMembers(group, members) {
        for (const { id } of members) {
            if (!group.members.get('' + id)) {
                group.members.set('' + id, new Mongoose.Types.Map())
            }
        }
        return group.save()
    },
    removeMember(group, member_id) {
        // TODO: move debts to personal debts
        group.members.delete('' + member_id)
        return group.save()
    }
}

export default methods
