import groupModel from '#/database/models/Group'
import getLocale from '#/locale/Locale'

import {
    group_join
} from '#/bot/Constants'

/**
 * Greets new group with 'new group' message
 */
export default function(this: Enhancer.TelegramBot) {
    this.on('new_chat_members', onNewChatMembers.bind(this))
    this.on('group_chat_created', onGroupCreated.bind(this))
    this.on('supergroup_chat_created', onGroupCreated.bind(this))
}

async function onNewChatMembers(this: Enhancer.TelegramBot, msg: Enhancer.Message) {
    const me = await this.getMe()
    let new_members = msg.new_chat_members ?? []
    const me_index = new_members.findIndex(({ id }) => id == me.id)
    let group: DataBase.Group.Document
    if (me_index != -1) {
        new_members.splice(me_index, 1)
        group = await onNewChat(this, msg, new_members[0]?.language_code)
    } else {
        let tgroup = await groupModel.getGroup(msg.chat.id)
        if (!tgroup) {
            throw new Error('Group with bot not found in database')
        }
        group = tgroup
    }
    group.member_ids.nonAtomicPush(...new_members.map(({ id }) => id))
    return group.save()
}

function onGroupCreated(this: Enhancer.TelegramBot, msg: Enhancer.Message) {
    return onNewChat(this, msg)
}

async function onNewChat(bot: Enhancer.TelegramBot, msg: Enhancer.Message, code?: string) {
    const locale = getLocale(code)
    const { message_id } = await bot.sendMessage(msg.chat.id, locale.newGroup, {
        reply_markup: {
            inline_keyboard: [
                [ { text: locale.buttons.join, callback_data: group_join } ]
            ]
        }
    })
    return groupModel.makeGroup(msg.chat.id, message_id, code)
}
