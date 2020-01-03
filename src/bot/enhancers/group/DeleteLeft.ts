import groupModel from '#/database/models/Group'

/**
 * Deletes users who have left the group from group document in database
 */
export default function(this: Enhancer.TelegramBot) {
    this.on('left_chat_member', deleteLeftUser.bind(this))
}

async function deleteLeftUser(this: Enhancer.TelegramBot, msg: Enhancer.Message) {
    if (msg.left_chat_member) {
        const group = await groupModel.makeOrGetGroup(msg.chat)
        group.here_ids.pull(msg.left_chat_member.id)
        return group.save()
    }
}
