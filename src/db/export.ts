import TelegramBot from 'node-telegram-bot-api';

import { DataBase } from './db';
import Mongoose from 'mongoose';

export * from './db';

import { updateUser, getName } from './models/user';
import { getDebts } from './models/debt';

export default function DB(url: string): DataBase {
    return { connect, getName, updateUser, getDebts };

    async function connect() {
        await Mongoose.connect(url);
    }
}
