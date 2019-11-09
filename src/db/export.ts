import Mongoose from 'mongoose';

import { DataBase } from './db';
export * from './db';

import { updateUser, getName } from './models/user';
import { getDebts } from './models/debt';
import { createOffer, deleteOffer } from './models/offer';

export default function DB(url: string): DataBase {
    return { connect, getName, updateUser, getDebts, createOffer, deleteOffer };

    async function connect() {
        await Mongoose.connect(url);
    }
}
