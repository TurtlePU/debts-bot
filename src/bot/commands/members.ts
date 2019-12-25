import groupModel from '#/database/models/Group'

import membersReplyMarkup from '#/helpers/MembersReplyMarkup'
import getNames           from '#/helpers/GetNames'

import getLocale from '#/locale/Locale'

/**
 * Responds with list of group members stored in database
 */
const command: Enhancer.Command = {
    key: /\/members/u,
    async callback(msg) {
        const locale = getLocale(msg.from?.language_code)
        if (msg.chat.type == 'group' || msg.chat.type == 'supergroup') {
            return this.sendMessage(
                msg.chat.id,
                locale.group.members(await getNames(await groupModel.makeOrGetGroup(msg.chat.id))),
                membersReplyMarkup(locale)
            )
        } else {
            return this.sendMessage(msg.chat.id, locale.group.notGroup)
        }
    }
}

export default command

