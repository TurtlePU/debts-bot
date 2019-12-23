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
    const new_members = msg.new_chat_members ?? []
    const me_index = new_members.findIndex(({ id }) => id == me.id)
    if (me_index != -1) {
        const not_me = me_index == 0 ? 1 : me_index - 1
        return onNewChat(this, msg, getLocale(new_members[not_me]?.language_code))
    }
}

function onGroupCreated(this: Enhancer.TelegramBot, msg: Enhancer.Message) {
    return onNewChat(this, msg, getLocale())
}

function onNewChat(bot: Enhancer.TelegramBot, msg: Enhancer.Message, locale: Locale) {
    return bot.sendMessage(msg.chat.id, locale.newGroup, {
        reply_markup: {
            inline_keyboard: [
                [ { text: locale.buttons.join, callback_data: group_join } ]
            ]
        }
    })
}
