declare namespace DataBase {
    namespace Offer {
        /**
         * List of possible offer types
         */
        type Typenames = {
            group: never
            debt: never
            settleup: never
        }
        namespace _private {
            /**
             * Base type for all offers
             */
            type Base = {
                id: string
                from_id: number
            }
            type Type<T extends keyof Typenames> = Selector<{}, { type: T }>
            /**
             * Part specific for debt offers
             */
            type DebtPart = {
                debt: Debt.Info
            }
            /**
             * Part specific for group debt offers
             */
            type GroupPart<T> = {
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
            /**
             * GroupPart returned from database
             */
            type GroupPartOutput = GroupPart<MongoArray<number>>
            /**
             * Selector of GroupPart-s
             */
            type GroupPartSelector = Selector<GroupPart<number[]>, GroupPartOutput>
            /**
             * Offer types
             */
            type Types<K extends keyof Selector> = {
                settleup: Base & Type<'settleup'>[K]
                debt: Base & Type<'debt'>[K] & DebtPart
                group: Base & Type<'group'>[K] & DebtPart & GroupPartSelector[K]
            }
            /**
             * Offer how it is stored in database
             */
            type InDatabase =
                Base & Type<keyof Typenames>['else'] & Partial<DebtPart & GroupPartOutput>
        }
        /**
         * Offers how they should be provided to database
         */
        type Inputs = _private.Types<'then'>
        type Input = Inputs['debt'] | Inputs['group'] | Inputs['settleup']
        /**
         * Offers how they are returned from database
         */
        type Outputs = _private.Types<'else'>
        /**
         * Document on top of offer
         */
        type Document<Type = _private.InDatabase> = DataBase.Document & Type & {
            created: Date
        }
        /**
         * Documents on top of Output offers
         */
        type Documents = {
            [K in keyof Inputs]: Document<Outputs[K]>
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
            createOffer<K extends keyof Inputs>(type: K, offer: Inputs[K]): Promise<Documents[K]>
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
