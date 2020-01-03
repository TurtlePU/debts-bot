declare namespace Locale {
    /**
     * Format used in `Locale.debts` method
     */
    type Debt = DataBase.Debt.Info & {
        to: string
    }
    /**
     * Article format for inline mode
     */
    type Article = {
        /**
         * Title of article
         */
        title: string
        /**
         * Text of article
         */
        text: string
    }
    type BalanceUpdate = {
        username: string
        delta: number
    }
}

/**
 * List of texts used to interact with users
 */
declare type Locale = {
    /**
     * Default currency for users of given locale
     */
    currency: string
    /**
     * Collection of message texts
     */
    messageTexts: {
        /**
         * Default response to messages without sender
         */
        anon: string
        /**
         * @param name of user
         * @returns text sent on `/start` command
         */
        hi(name: string): string
        /**
         * @param debts list of debts
         * @returns formatted list of user's debts
         */
        debts(debts: Locale.Debt[]): string
        /**
         * Placeholder for message which will soon update
         */
        toUpdate: string
        /**
         * Sent if debt is requested not in group / inline mode
         */
        wrongChatForDebt: string
        /**
         * Group-related message texts
         */
        group: {
            /**
             * Greeting for a new group
             */
            hi: string
            /**
             * Sent if request can be fulfilled only for a group
             */
            notGroup: string
            /**
             * Formats a list of names
             * @param names members' names
             */
            members(names: string[]): string
            /**
             * Formats a list of balances in group
             * @param balances list of balances
             */
            balances(balances: Locale.Debt[]): string
            /**
             * Formats a group debt offer current state
             * @param amount of debt
             * @param currency of debt
             * @param payers list of those who pay
             * @param members list of those who benefited
             */
            offer(amount: number, currency: string, payers: string[], members: string[]): string
            offerSaved(updates: Locale.BalanceUpdate[], amount: number, currency: string): string
        }
        /**
         * @param from offerer of debt
         * @param to offer acceptor
         * @param amount amount of money in debt offer
         * @param currency currency of money in debt offer
         * @returns text to show after debt offer was accepted
         */
        offerSaved(from: string, to: string, amount: number, currency: string): string
        /**
         * @param first offerer of settle-up
         * @param second offer acceptor
         * @returns text to show after the settle-up offer was accepted
         */
        settledUp(first: string, second: string): string
    }
    /**
     * Resources which can be used in multiple ways
     */
    hybrid: {
        offer: {
            /**
             * Info: offer is expired (that means, it was not found in a database)
             */
            expired: string
            /**
             * @param by the one who declined the offer
             * @returns text used to show instead of declined offer
             */
            declined(by: string): string
        }
    }
    /**
     * Button texts
     */
    buttons: {
        /**
         * Text on 'accept' button
         */
        accept: string
        /**
         * Text on 'decline' button
         */
        reject: string
        /**
         * Text on 'join' button
         */
        join: string
        /**
         * Text on 'update members' button
         */
        updateMembers: string
        /**
         * Buttons for keyboard below group debt offer
         */
        joinPayers: string
        /**
         * Buttons for keyboard below group debt offer
         */
        leavePayers: string
        /**
         * Buttons for keyboard below group debt offer
         */
        joinMembers: string
        /**
         * Buttons for keyboard below group debt offer
         */
        leaveMembers: string
        /**
         * Buttons for keyboard below group debt offer
         */
        lockOffer: string
        /**
         * Buttons for keyboard below group debt offer
         */
        cancelOffer: string
    }
    /**
     * Articles for inline mode
     */
    articles: {
        /**
         * @param amount amount of money in debt offer
         * @param currency currency of money in debt offer
         */
        offer(amount: number, currency: string): Locale.Article
        settleUp: Locale.Article
    }
    /**
     * OnClick responses
     */
    response: {
        /**
         * Response on member list update
         */
        membersUpdated: string
        /**
         * Response on successful 'Join' click
         */
        joinSuccess: string
        /**
         * Info: you can't accept an offer from yourself
         */
        selfAccept: string
        /**
         * Response on succesful 'Cancel' click
         */
        offerCanceled: string
    }
}
