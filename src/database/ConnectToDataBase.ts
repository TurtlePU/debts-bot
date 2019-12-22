import Mongoose from 'mongoose'

export function connectToDataBase(url: string) {
    return Mongoose.connect(url, {
        useFindAndModify: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
}
