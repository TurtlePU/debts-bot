import groupModel from '#/database/models/Group'

import {
    deleteUser
} from '#/util/FallbackAnswers'

export default function(this: Enhancer.TelegramBot) {
    this.on('left_chat_member', async msg =>
        deleteUser(
            await groupModel.getGroup(msg.chat.id),
            msg.left_chat_member?.id)
    )
}
