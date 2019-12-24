import groupModel from '#/database/models/Group'

import {
    deleteUser
} from '#/util/FallbackAnswers'

export default function(this: Enhancer.TelegramBot) {
    this.on('left_chat_member', deleteLeftUser)
}

async function deleteLeftUser(msg: Enhancer.Message) {
    return deleteUser(await groupModel.getGroup(msg.chat.id), msg.left_chat_member?.id)
}
