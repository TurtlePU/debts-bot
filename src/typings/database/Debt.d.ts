declare namespace DataBase {
    /**
     * Debt how it is returned from model
     */
    type Debt = Debt.Info & { to: Debt.Endpoint }
    namespace Debt {
        type Endpoint = {
            id: number
            is_group: boolean
        }
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
        type Input = Debt & { from: Debt.Endpoint }
        /**
         * Mongoose document on top of debt
         */
        type Document = DataBase.Document & Input
        /**
         * Collection of methods to work with Debts in database
         */
        type Model = {
            saveGroupDebt(
                group_id: number, from: number[], to: number[], info: Info
            ): Promise<[number, number][]>
            /**
             * Adds new debt to database (includes basic simplification of debts)
             */
            saveDebt(debt: Input): Promise<Document>
            /**
             * Gets balances of endpoint how they are stored in database
             */
            getDebts(endpoint: Debt.Endpoint): Promise<Debt[]>
            /**
             * Clears all debts between two endpoints
             */
            clearDebts(first: Debt.Endpoint, second: Debt.Endpoint): Promise<void>
        }
    }
}
