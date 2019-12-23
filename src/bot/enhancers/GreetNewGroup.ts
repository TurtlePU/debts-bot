import getLocale from '#/locale/Locale'

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

async function onNewChat(bot: Enhancer.TelegramBot, msg: Enhancer.Message, locale: Locale) {
    const { message_id } = await bot.sendMessage(msg.chat.id, locale.newGroup)
    return pin(bot, msg.chat.id, message_id, locale)
}

async function pin(bot: Enhancer.TelegramBot, chat_id: number, message_id: number, locale: Locale) {
    try {
        if (!await bot.pinChatMessage(chat_id, '' + message_id)) {
            return bot.sendMessage(chat_id, locale.pinFailed)
        }
    } catch {
        return bot.sendMessage(chat_id, locale.pinFailed)
    }
}
