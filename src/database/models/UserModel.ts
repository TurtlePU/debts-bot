import Mongoose from 'mongoose'

import {
    getUserName
} from '#/util/StringUtils'

const UserModel = Mongoose.model<DataBase.User.Doc>('User', new Mongoose.Schema({
    _id: { type: Number, required: true },
    name: { type: String, required: true }
}))

export default {
    updateUser,
    getUser: UserModel.findById.bind(UserModel)
}

async function updateUser(user: import('node-telegram-bot-api').User) {
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
