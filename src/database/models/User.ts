import Mongoose from 'mongoose'

import {
    getUserName
} from '#/util/StringUtils'

const UserModel = Mongoose.model<DataBase.User.Document>('User', new Mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}))

const methods: DataBase.User.Model = {
    updateUser,
    getUser: UserModel.findById.bind(UserModel)
}

export default methods

async function updateUser(user: Enhancer.User) {
    const userDoc = await UserModel.findById(user.id)
    if (userDoc) {
        userDoc.name = getUserName(user)
        return userDoc.save()
    } else {
        return new UserModel({
            _id: user.id,
            name: getUserName(user)
        }).save()
    }
}
