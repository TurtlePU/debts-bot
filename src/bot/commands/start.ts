import getLocale from '#/locale/Locale'

import { group_join } from '#/bot/Constants'

import {   isGroup   } from '#/util/Predicates'
import { getUserName } from '#/util/StringUtils'

/**
 * Shows basic help message on /start command
 */
const command: Enhancer.Command = {
    key: /\/start/u,
    callback(msg) {
        const locale = getLocale(msg.from?.language_code)
        if (isGroup(msg.chat)) {
            return this.sendMessage(msg.chat.id, locale.messageTexts.group.hi, {
                reply_markup: {
                    inline_keyboard: [
                        [ { text: locale.buttons.join, callback_data: group_join } ]
                    ]
                }
            })
        } else if (!msg.from) {
            return this.sendMessage(msg.chat.id, locale.messageTexts.anon)
        } else {
            return this.sendMessage(msg.chat.id, locale.messageTexts.hi(getUserName(msg.from)))
        }
    }
}

export default command
