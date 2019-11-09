import Mongoose from 'mongoose'
import TelegramBot from 'node-telegram-bot-api';

export async function updateUser(user: TelegramBot.User) {
    const userDoc = await UserModel.findById(user.id);
    if (userDoc) {
        userDoc.name = getName(user);
        return userDoc.save();
    } else {
        return makeUser(user).save();
    }
}

export function getName({ first_name, last_name, username }: TelegramBot.User) {
    return username || (first_name + (last_name ? ` ${last_name}` : ''));
}

type User = {
    _id: number
    name: string
}

type UserDoc = Mongoose.Document & User;

const UserModel = Mongoose.model<UserDoc>('User', new Mongoose.Schema({
    _id: { type: Number, required: true },
    name: { type: String, required: true }
}));

function makeUser(user: TelegramBot.User) {
    return new UserModel({
        _id: user.id,
        name: getName(user)
    });
}
