import groupModel from '#/database/models/Group'

import membersReplyMarkup from '#/helpers/MembersReplyMarkup'
import getNames           from '#/helpers/GetNames'

import getLocale from '#/locale/Locale'

import {
    isGroup
} from '#/util/Predicates'

/**
 * Responds with list of group members stored in database
 */
const command: Enhancer.Command = {
    key: /\/members/u,
    async callback(msg) {
        const locale = getLocale(msg.from?.language_code)
        if (isGroup(msg.chat)) {
            const group = await groupModel.makeOrGetGroup(msg.chat.id)
            const names = await getNames(group.here_ids)
            return this.sendMessage(
                msg.chat.id,
                locale.messageTexts.group.members(names),
                membersReplyMarkup(locale)
            )
        } else {
            return this.sendMessage(msg.chat.id, locale.messageTexts.group.notGroup)
        }
    }
}

export default command

