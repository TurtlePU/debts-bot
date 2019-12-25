declare namespace DataBase {
    /**
     * Group how it is stored in database
     */
    type Group = {
        _id: number
        /**
         * IDs of users present in the group
         */
        here_ids: MongoArray<number>
        /**
         * Nonzero balances of all users who once been in this group
         * (member id) => (currency) => (amount)
         */
        balances: MongoMap<MongoMap<number>>
    }
    namespace Group {
        /**
         * Mongoose document on top of group
         */
        type Document = DataBase.Document & Group
        /**
         * Collection of useful methods to work with Group model
         */
        type Model = {
            /**
             * Tries to get group; if not found, creates new and returns it
             * @param id of a group
             */
            makeOrGetGroup(id: number): Promise<Document>
            /**
             * Tries to get group; returns null if not found
             * @param id of a group
             */
            getGroup(id: number): DocumentQuery<Document>
        }
    }
}
