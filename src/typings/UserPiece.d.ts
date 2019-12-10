declare type User = {
    _id: number
    name: string
}

declare type UserDoc = import('mongoose').Document & User

declare type UserPiece = {
    updateUser(user: import('node-telegram-bot-api').User): Promise<UserDoc>
    getUser(id: number): PromiseLike<UserDoc | null>
}
