import Mongoose from 'mongoose'

const BalanceSchema = new Mongoose.Schema({
    currency: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
})

const MemberSchema = new Mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    balance: [ BalanceSchema ]
})

const GroupModel = Mongoose.model<DataBase.Group.Document>('Group', new Mongoose.Schema({
    _id: Number,
    members: [ MemberSchema ]
}))

const methods: DataBase.Group.Model = {
    async makeOrGetGroup(_id) {
        return await this.getGroup(_id) ?? new GroupModel({ _id }).save()
    },
    getGroup: GroupModel.findById.bind(GroupModel),
    addMembers(group, members) {
        group.members.addToSet(...members.map(({ id }) => ({ _id: id })))
        return group.save()
    },
    removeMember(group, member_id) {
        group.members.pull(member_id)
        return group.save()
    }
}

export default methods
