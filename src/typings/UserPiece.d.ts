declare namespace DataBase {
    type User = {
        _id: number
        name: string
    }
    namespace User {
        type Doc = import('mongoose').Document & User
        type Piece = {
            updateUser(user: import('node-telegram-bot-api').User): Promise<Doc>
            getUser(id: number): PromiseLike<Doc | null>
        }
    }
}
