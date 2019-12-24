import groupModel from '#/database/models/Group'
import userModel  from '#/database/models/User'

import getLocale from '#/locale/Locale'

import {
    isDefined
} from '#/util/Predicates'

import {
    group_join
} from '#/bot/Constants'

/**
 * Responds with list of group members stored in database
 */
const command: Enhancer.Command = {
    key: /\/members/u,
    async callback(msg) {
        const locale = getLocale(msg.from?.language_code)
        if (msg.chat.type == 'group' || msg.chat.type == 'supergroup') {
            return this.sendMessage(msg.chat.id,
                locale.group.members(await getNames(msg.chat.id)),
                {
                    reply_markup: {
                        inline_keyboard: [
                            [ { text: locale.buttons.join, callback_data: group_join } ]
                        ]
                    }
                }
            )
        } else {
            return this.sendMessage(msg.chat.id, locale.group.notGroup)
        }
    }
}

export default command

async function getNames(group_id: number) {
    const group = await groupModel.makeOrGetGroup(group_id)
    const users = await Promise.all([ ...group.members.keys() ].map(id => userModel.getUser(+id)))
    return users.filter(isDefined).map(({ name }) => name)
}
