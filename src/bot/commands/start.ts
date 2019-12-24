import getLocale from '#/locale/Locale'

import {
    getUserName
} from '#/util/StringUtils'

/**
 * Shows basic help message on /start command
 */
const command: Enhancer.Command = {
    key: /\/start/u,
    callback(msg) {
        const locale = getLocale(msg.from?.language_code)
        let message: string
        if (msg.chat.type == 'group' || msg.chat.type == 'supergroup') {
            message = locale.group.hi
        } else if (!msg.from) {
            message = locale.anon
        } else {
            message = locale.hi(getUserName(msg.from))
        }
        return this.sendMessage(msg.chat.id, message)
    }
}

export default command
