declare namespace DataBase {
    /**
     * TypeScript magic above Offer properties stored in DataBase
     */
    type Offer = Offer.DebtType | Offer.Base<'settleup'> | Offer.GroupType
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
         * Part specific for group debt offers
         */
        type GroupPart = {
            group: {
                /**
                 * Those who paid
                 */
                payer_ids: MongoArray<number>
                /**
                 * Those who used money
                 */
                member_ids: MongoArray<number>
            }
        }
        /**
         * Type of debt offer
         */
        type DebtType = Base<'debt'> & DebtPart
        /**
         * Type of group debt offer
         */
        type GroupType = Base<'group'> & DebtPart & GroupPart
        /**
         * Offer properties how they are stored in DataBase
         */
        type InDataBase =
            Base<'debt' | 'settleup' | 'group'> & Partial<DebtPart> & Partial<GroupPart>
        /**
         * Mongoose document on top of Offer properties in DataBase
         */
        type Document = DataBase.Document & InDataBase & {
            id: string
            created: Date
        }
        /**
         * Collection of methods to work with offers in DataBase
         */
        type Model = {
            /**
             * Creates new inline-mode offer
             * @param id of new offer
             * @param offer offer object
             */
            createInlineOffer(id: string, offer: Offer): Promise<Document>
            /**
             * Creates new in-group offer
             * @param id of new offer
             * @param offer offer object
             */
            createGroupOffer(id: string, offer: Offer): Promise<Document>
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
