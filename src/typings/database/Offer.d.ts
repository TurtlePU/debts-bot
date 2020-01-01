declare namespace DataBase {
    type Offer = Offer.Types.Debt | Offer.Types.SettleUp | Offer.Types.Group
    namespace Offer {
        /**
         * Base type for all offers
         */
        type Base<T extends string> = {
            from_id: number
            type: T
        }
        namespace Parts {
            /**
             * Part specific for debt offers
             */
            type Debt = {
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
            type Group = Group.Base<MongoArray<number>>
            namespace Group {
                type Base<T> = {
                    group: {
                        /**
                         * Those who paid
                         */
                        payer_ids: T
                        /**
                         * Those who used money
                         */
                        member_ids: T
                    }
                }
                type Input = Base<number[]>
            }
        }
        namespace Types {
            type Debt = Base<'debt'> & Parts.Debt
            type SettleUp = Base<'settleup'>
            type Group = Group.Base & Parts.Group
            namespace Group {
                type Base = Offer.Base<'group'> & Parts.Debt
                type Input = Base & Parts.Group.Input
            }
        }
        type Input = Types.Debt | Types.SettleUp | Types.Group.Input
        /**
         * Offer properties how they are stored in DataBase
         */
        type InDatabase =
            Offer.Base<'debt' | 'settleup' | 'group'>
            & Partial<Offer.Parts.Debt & Offer.Parts.Group>
        /**
         * Mongoose document on top of Offer properties in DataBase
         */
        type Document<Type = InDatabase> = DataBase.Document & Type & {
            id: string
            created: Date
        }
        namespace Document {
            type Debt = Document<Types.Debt>
            type Group = Document<Types.Group>
            type SettleUp = Document<Types.SettleUp>
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
            createOffer(id: string, offer: Types.Debt): Promise<Document.Debt>
            /**
             * Creates new offer
             * @param id of new offer
             * @param offer offer object
             */
            createOffer(id: string, offer: Types.SettleUp): Promise<Document.SettleUp>
            /**
             * Creates new offer
             * @param id of new offer
             * @param offer offer object
             */
            createOffer(id: string, offer: Types.Group.Input): Promise<Document.Group>
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
