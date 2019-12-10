import Mongoose from 'mongoose'

import { getUserName } from '#/util/StringUtils'

const UserModel = Mongoose.model<UserDoc>('User', new Mongoose.Schema({
    _id: { type: Number, required: true },
    name: { type: String, required: true }
}))

const userPiece: UserPiece = {
    updateUser,
    getUser: UserModel.findById.bind(UserModel)
}

export default userPiece

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
