import Mongoose from 'mongoose'

/**
 * Connects to database
 * @param url of a database to connect to
 */
export function connectToDataBase(url: string) {
    return Mongoose.connect(url, {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
}
