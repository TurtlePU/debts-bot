import getLocale from '#/locale/Locale'

import {
    noUserResponse
} from '#/util/FallbackAnswers'

import {
    getUserName
} from '#/util/StringUtils'

const command: Enhancer.Command = {
    key: /\/start/u,
    callback(msg) {
        if (!msg.from) {
            return noUserResponse.call(this, msg)
        } else {
            return this.sendMessage(msg.chat.id,
                getLocale(msg.from.language_code).hi(getUserName(msg.from)))
        }
    }
}

export default command
