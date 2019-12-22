declare namespace DataBase {
    /**
     * Properties of User which are stored in DataBase
     */
    type User = {
        _id: number
        name: string
    }
    namespace User {
        /**
         * Mongoose document on top of User type
         */
        type Document = DataBase.Document & User
        /**
         * Collection of methods to work with Users in DataBase
         */
        type Model = {
            /**
             * Updates properties of user in database
             * @param user Telegram user
             */
            updateUser(user: Enhancer.User): Promise<Document>
            /**
             * @param id of a user
             * @returns Promise which resolves with properties of user with given ID (if present)
             */
            getUser(id: number): PromiseLike<Document | null>
        }
    }
}