import offerModel from '#/database/models/Offer'

import getLocale from '#/locale/Locale'

import { group_debt_cancel } from '#/bot/Constants'

import { groupOfferId } from '#/helpers/IdGenerator'

import { getUserName } from '#/util/StringUtils'

/**
 * Cancels group debt offer
 */
const onClick: Enhancer.OnClickStrict = {
    key: group_debt_cancel,
    async callback({ from, message }) {
        const locale = getLocale(from.language_code)
        const offerId = groupOfferId(message.chat.id, message.message_id)
        await offerModel.deleteOffer(offerId)
        await this.editMessageText(locale.hybrid.offer.declined(getUserName(from)), {
            chat_id: message.chat.id, message_id: message.message_id
        })
        return { text: locale.response.offerCanceled }
    }
}

export default onClick
