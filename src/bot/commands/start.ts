import getLocale from '#/locale/Locale'

import inlineKeyboard from '#/util/InlineKeyboard'

import { group_join } from '#/bot/Constants'

import {   isGroup   } from '#/util/Predicates'
import { getUserName } from '#/util/StringUtils'

/**
 * Shows basic help message on /start command
 */
const command: Enhancer.Command = {
    key: /\/start/u,
    callback({ chat, from }) {
        const { messageTexts, buttons } = getLocale(from?.language_code)
        if (isGroup(chat)) {
            return this.sendMessage(chat.id, messageTexts.group.hi, {
                reply_markup: inlineKeyboard([ [ [ buttons.join, group_join ] ] ])
            })
        } else if (!from) {
            return this.sendMessage(chat.id, messageTexts.anon)
        } else {
            return this.sendMessage(chat.id, messageTexts.hi(getUserName(from)))
        }
    }
}

export default command
