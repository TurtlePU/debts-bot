declare namespace DataBase {
    type User = {
        _id: number
        name: string
    }
    namespace User {
        type Document = DataBase.Document & User
        type Model = {
            updateUser(user: Enhancer.User): Promise<Document>
            getUser(id: number): PromiseLike<Document | null>
        }
    }
}
