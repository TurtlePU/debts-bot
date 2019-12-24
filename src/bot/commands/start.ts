import getLocale from '#/locale/Locale'

import {
    getUserName
} from '#/util/StringUtils'

import {
    group_join
} from '#/bot/Constants'

/**
 * Shows basic help message on /start command
 */
const command: Enhancer.Command = {
    key: /\/start/u,
    callback(msg) {
        const locale = getLocale(msg.from?.language_code)
        if (msg.chat.type == 'group' || msg.chat.type == 'supergroup') {
            return this.sendMessage(msg.chat.id, locale.group.hi, {
                reply_markup: {
                    inline_keyboard: [
                        [ { text: locale.buttons.join, callback_data: group_join } ]
                    ]
                }
            })
        } else if (!msg.from) {
            return this.sendMessage(msg.chat.id, locale.anon)
        } else {
            return this.sendMessage(msg.chat.id, locale.hi(getUserName(msg.from)))
        }
    }
}

export default command
