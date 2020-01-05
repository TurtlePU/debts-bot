import groupModel from '#/database/models/Group'
import userModel  from '#/database/models/User'

import getLocale from '#/locale/Locale'

import { group_join } from '#/bot/Constants'

/**
 * Greets new group with 'new group' message;
 * Writes new members to group document in database
 */
export default function(this: Enhancer.TelegramBot) {
    this.on('new_chat_members', onNewChatMembers.bind(this))
    this.on('group_chat_created', onGroupCreated.bind(this))
    this.on('supergroup_chat_created', onGroupCreated.bind(this))
}

async function onNewChatMembers(this: Enhancer.TelegramBot, msg: Enhancer.Message) {
    const me = await this.getMe()
    const new_members = (msg.new_chat_members ?? []).filter(({ id }) => id != me.id)
    for (const member of new_members) {
        userModel.updateUser(member)
    }
    const group = await groupModel.getGroup(msg.chat.id)
                  ?? await onNewChat(this, msg, new_members[0]?.language_code)
    group.here_ids.addToSet(...new_members.map(({ id }) => id))
    return group.save()
}

function onGroupCreated(this: Enhancer.TelegramBot, msg: Enhancer.Message) {
    return onNewChat(this, msg)
}

function onNewChat(bot: Enhancer.TelegramBot, msg: Enhancer.Message, code?: string) {
    const locale = getLocale(code)
    bot.sendMessage(msg.chat.id, locale.messageTexts.group.hi, {
        reply_markup: {
            inline_keyboard: [
                [ { text: locale.buttons.join, callback_data: group_join } ]
            ]
        }
    })
    return groupModel.makeOrGetGroup(msg.chat)
}
