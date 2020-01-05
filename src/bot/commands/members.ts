import groupModel from '#/database/models/Group'

import membersReplyMarkup from '#/helpers/MembersReplyMarkup'
import getNames           from '#/helpers/GetNames'

import getLocale from '#/locale/Locale'

import { isGroup } from '#/util/Predicates'

/**
 * Responds with list of group members stored in database
 */
const command: Enhancer.Command = {
    key: /\/members/u,
    async callback({ chat, from }) {
        const locale = getLocale(from?.language_code)
        if (isGroup(chat)) {
            const { here_ids } = await groupModel.makeOrGetGroup(chat)
            const names = await getNames(here_ids)
            return this.sendMessage(chat.id, locale.messageTexts.group.members(names),
                { reply_markup: membersReplyMarkup(locale) }
            )
        } else {
            return this.sendMessage(chat.id, locale.messageTexts.group.notGroup)
        }
    }
}

export default command

