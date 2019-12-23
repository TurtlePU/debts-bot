declare namespace DataBase {
    /**
     * TypeScript magic above Offer properties stored in DataBase
     */
    type Offer = Offer.DebtType | Offer.Base<'settleup'>
    namespace Offer {
        /**
         * Base type for all offers
         */
        type Base<T extends string> = {
            from_id: number
            type: T
        }
        /**
         * Part specific for debt offers
         */
        type DebtPart = {
            debt: {
                /**
                 * Amount of money in offer
                 */
                amount: number
                /**
                 * Currency of money in offer
                 */
                currency: string
            }
        }
        /**
         * Type of debt offer
         */
        type DebtType = Base<'debt'> & DebtPart
        /**
         * Offer properties how they are stored in DataBase
         */
        type InDataBase = Base<'debt' | 'settleup'> & Partial<DebtPart>
        /**
         * Mongoose document on top of Offer properties in DataBase
         */
        type Document = DataBase.Document & InDataBase & {
            _id: string
            created: Date
        }
        /**
         * Collection of methods to work with offers in DataBase
         */
        type Model = {
            /**
             * Creates new offer
             * @param id of new offer
             * @param offer offer object
             */
            createOffer(id: string, offer: Offer): Promise<Document>
            /**
             * @param id of an offer
             * @returns props of offer how they are stored in DataBase (if present)
             */
            getOffer(id: string): DocumentQuery<Document>
            /**
             * Deletes an offer by given id
             * @param id of an offer
             */
            deleteOffer(id: string): DocumentQuery<Document>
        }
    }
}
