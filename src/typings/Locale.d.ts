declare namespace Locale {
    /**
     * Format used in `Locale.debts` method
     */
    type Debt = DataBase.Debt.Info & {
        to: string
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
     * Default response to messages without sender
     */
    anon: string
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
        leavePayers: string
        joinMembers: string
        leaveMembers: string
        lockOffer: string
    }
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
     * @param amount amount of money in debt offer
     * @param currency currency of money in debt offer
     * @returns title & text of debt offer sent via inline mode
     */
    offerArticle(amount: number, currency: string): {
        title: string
        text: string
    }
    /**
     * List of constants related to offers
     */
    offer: {
        /**
         * Info: message is expired (that means, it was not found in a database)
         */
        expired: string
        /**
         * Info: you can't accept an offer from yourself
         */
        selfAccept: string
        /**
         * @param by the one who declined the offer
         * @returns text used to show instead of declined offer
         */
        declined(by: string): string
        /**
         * @param from offerer of debt
         * @param to offer acceptor
         * @param amount amount of money in debt offer
         * @param currency currency of money in debt offer
         * @returns text to show after debt offer was accepted
         */
        saved(from: string, to: string, amount: number, currency: string): string
    }
    /**
     * title & text of settle up offer sent via inline mode
     */
    settleUpArticle: {
        /**
         * title of settle up offer sent via inline mode
         */
        title: string
        /**
         * text of settle up offer sent via inline mode
         */
        text: string
    }
    /**
     * @param first offerer of settle-up
     * @param second offer acceptor
     * @returns text to show after the settle-up offer was accepted
     */
    settleUp(first: string, second: string): string
    /**
     * Group-related strings
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
         * Formats a group debt offer current state
         * @param amount of debt
         * @param currency of debt
         * @param payers list of those who pay
         * @param members list of those who benefited
         */
        offer(amount: number, currency: string, payers: string[], members: string[]): string
    }
    /**
     * OnClick responses to click on 'join'
     */
    join: {
        /**
         * Response on success
         */
        success: string
    }
    /**
     * OnClick responses
     */
    response: {
        /**
         * Response on member list update
         */
        membersUpdated: string
    }
    /**
     * Placeholder for message which will soon update
     */
    toUpdate: string
    /**
     * Sent if debt is requested not in group / inline mode
     */
    wrongChatForDebt: string
}
