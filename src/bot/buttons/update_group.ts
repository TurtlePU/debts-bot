import membersReplyMarkup from '#/bot/helpers/MembersReplyMarkup'
import deleteUsers        from '#/bot/helpers/DeleteUsers'
import getNames           from '#/bot/helpers/GetNames'

import groupModel from '#/database/models/Group'

import getLocale from '#/locale/Locale'

import {
    group_update_members
} from '#/bot/Constants'

/**
 * Removes kicked members from list saved in group document
 */
const listener: Enhancer.OnClick = {
    key: group_update_members,
    async callback(query) {
        const locale = getLocale(query.from.language_code)
        const group = await groupModel.makeOrGetGroup(query.message.chat.id)
        await deleteKicked(this, group)
        this.editMessageText(locale.group.members(await getNames(group)), {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id,
            reply_markup: membersReplyMarkup(locale).reply_markup
        })
        return {
            text: locale.response.membersUpdated
        }
    }
}

export default listener

async function deleteKicked(bot: Enhancer.TelegramBot, group: DataBase.Group.Document) {
    if (await bot.getChatMembersCount(group.id) != group.members.size) {
        const members = await Promise.all(
            [ ...group.members.keys() ].map(id => bot.getChatMember(group.id, id)))
        return deleteUsers(
            group, members.filter(({ status }) => status == 'kicked').map(({ user }) => user.id))
    }
}
