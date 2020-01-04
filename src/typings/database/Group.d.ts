declare namespace DataBase {
    /**
     * Group how it is stored in database
     */
    type Group = {
        _id: number
        title: string
        /**
         * IDs of users present in the group
         */
        here_ids: MongoArray<number>
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
             */
            makeOrGetGroup(group: import('node-telegram-bot-api').Chat): Promise<Document>
            /**
             * Tries to get group; returns null if not found
             * @param id of a group
             */
            getGroup(id: number): DocumentQuery<Document>
        }
    }
}
