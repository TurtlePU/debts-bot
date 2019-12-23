import getLocale from '#/locale/Locale'

/**
 * Greets new group with 'new group' message
 */
export default function(this: Enhancer.TelegramBot) {
    this.on('new_chat_members', onNewChatMembers.bind(this))
    this.on('group_chat_created', onNewChatMembers.bind(this))
}

async function onNewChatMembers(this: Enhancer.TelegramBot, msg: Enhancer.Message) {
    const me = await this.getMe()
    const new_members = msg.new_chat_members ?? []
    console.log(new_members)
    const me_index = new_members.indexOf(me)
    if (me_index != -1) {
        const not_me = me_index == 0 ? 1 : me_index - 1
        return this.sendMessage(msg.chat.id, getLocale(new_members[not_me]?.language_code).newGroup)
    }
}
