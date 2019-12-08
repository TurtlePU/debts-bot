import Mongoose from 'mongoose'
import TelegramBot from 'node-telegram-bot-api'

import { getUserName } from '@util'

type User = {
    _id: number
    name: string
}

export type UserDoc = Mongoose.Document & User

export type UserPiece = {
    updateUser(user: TelegramBot.User): Promise<UserDoc>
    getUser(id: number): PromiseLike<UserDoc | null>
}

const UserModel = Mongoose.model<UserDoc>('User', new Mongoose.Schema({
    _id: { type: Number, required: true },
    name: { type: String, required: true }
}))

const userPiece: UserPiece = {
    updateUser,
    getUser: UserModel.findById.bind(UserModel)
}

export default userPiece

async function updateUser(user: TelegramBot.User) {
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
