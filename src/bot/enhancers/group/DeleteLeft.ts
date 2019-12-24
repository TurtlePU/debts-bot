import groupModel from '#/database/models/Group'

export default function(this: Enhancer.TelegramBot) {
    this.on('left_chat_member', deleteLeftUser.bind(this))
}

async function deleteLeftUser(this: Enhancer.TelegramBot, msg: Enhancer.Message) {
    const group = await groupModel.getGroup(msg.chat.id)
    await group?.member_ids.pull(msg.left_chat_member?.id)
    // edit text of first message
}
