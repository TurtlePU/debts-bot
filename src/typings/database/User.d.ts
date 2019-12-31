declare namespace DataBase {
    /**
     * How User is returned from Model
     */
    type User = {
        id: number
        name: string
        /**
         * IDs of groups in which user holds nonzero balance
         */
        debt_holder_in: MongoArray<number>
    }
    namespace User {
        /**
         * How User is supplied to Model
         */
        type Input = Enhancer.User
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
            updateUser(user: Input): Promise<Document>
            /**
             * @param id of a user
             * @returns Promise which resolves with properties of user with given ID (if present)
             */
            getUser(id: number): PromiseLike<Document | null>
        }
    }
}
