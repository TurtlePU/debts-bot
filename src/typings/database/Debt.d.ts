declare namespace DataBase {
    /**
     * Debt how it is returned from model
     */
    type Debt = Debt.Info & { to: number }
    namespace Debt {
        /**
         * Info about debt; also base class for different implementations
         */
        type Info = {
            amount: number
            currency: string
        }
        /**
         * Debt how it should be supplied to model
         */
        type Input = Debt & { from: number }
        /**
         * Mongoose document on top of debt
         */
        type Document = DataBase.Document & Input
        /**
         * Collection of methods to work with Debts in database
         */
        type Model = {
            /**
             * Adds new debt to database (includes basic simplification of debts)
             * @param debt Debt to be saved
             */
            saveDebt(debt: Input): Promise<Document>
            /**
             * Gets debts of user how they are stored in database
             * @param id of a user
             */
            getDebts(id: number): Promise<Debt[]>
            /**
             * Clears all debts between two users
             * @param first ID of a first user
             * @param second ID of a second user
             */
            clearDebts(first: number, second: number): Promise<void>
        }
    }
}
