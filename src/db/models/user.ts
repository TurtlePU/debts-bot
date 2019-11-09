import Mongoose from 'mongoose'
import TelegramBot from 'node-telegram-bot-api'

export async function updateUser(user: TelegramBot.User)
{
    const userDoc = await UserModel.findById(user.id)
    if (userDoc) {
        userDoc.name = getName(user)
        await userDoc.save()
    } else {
        await makeUser(user).save()
    }
}

export async function getNameById(id: number)
{
    const userDoc = await UserModel.findById(id)
    if (!userDoc) {
        throw new Error('User not found')
    }
    return userDoc.name
}

export function getName({ first_name, last_name, username }: TelegramBot.User)
{
    if (username) {
        return '@' + username
    } else if (last_name) {
        return first_name + ' ' + last_name
    } else {
        return first_name
    }
}

type User =
{
    _id: number
    name: string
}

type UserDoc = Mongoose.Document & User

const UserModel = Mongoose.model<UserDoc>('User', new Mongoose.Schema({
    _id: { type: Number, required: true },
    name: { type: String, required: true }
}))

function makeUser(user: TelegramBot.User) {
    return new UserModel({
        _id: user.id,
        name: getName(user)
    })
}
