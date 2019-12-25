import groupModel from '#/database/models/Group'

import deleteUsers from '#/helpers/DeleteUsers'

/**
 * Deletes users who have left the group from group document in database
 */
export default function(this: Enhancer.TelegramBot) {
    this.on('left_chat_member', deleteLeftUser.bind(this))
}

async function deleteLeftUser(this: Enhancer.TelegramBot, msg: Enhancer.Message) {
    const group = await groupModel.makeOrGetGroup(msg.chat.id)
    if (msg.left_chat_member) {
        return deleteUsers(group, [ msg.left_chat_member.id ])
    }
}
