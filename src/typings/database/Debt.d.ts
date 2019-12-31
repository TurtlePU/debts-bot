declare namespace DataBase {
    namespace Debt {
        /**
         * Info about debt; also base class for different implementations
         */
        type Info = {
            amount: number
            currency: string
        }
        /**
         * Debt how it is returned from model
         */
        type Output = Info & { to: number }
        /**
         * Debt how it should be supplied to model
         */
        type Input = Debt.Output & { from: number }
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
            getDebts(id: number): Promise<Output[]>
            /**
             * Clears all debts between two users
             * @param first ID of a first user
             * @param second ID of a second user
             */
            clearDebts(first: number, second: number): Promise<void>
        }
    }
}
