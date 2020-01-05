import groupModel from '#/database/models/Group'

import membersReplyMarkup from '#/helpers/MembersReplyMarkup'
import getNames from '#/helpers/GetNames'

import getLocale from '#/locale/Locale'

import { group_update_members } from '#/bot/Constants'

import { catchUnmodified } from '#/util/Catchers'

/**
 * Removes kicked members from list saved in group document
 */
const listener: Enhancer.OnClickStrict = {
    key: group_update_members,
    async callback({ message, from }) {
        const locale = getLocale(from.language_code)
        const group = await groupModel.makeOrGetGroup(message.chat)
        await deleteKicked(this, group)
        try {
            await updateText(this, group, locale, message.chat.id, message.message_id)
        } catch (error) {
            // TODO: Move to Locale
            return catchUnmodified(error, { text: 'No diff' })
        }
        return { text: locale.response.membersUpdated }
    }
}

export default listener

async function deleteKicked(bot: Enhancer.TelegramBot, group: DataBase.Group.Document) {
    if (await bot.getChatMembersCount(group.id) != group.here_ids.length) {
        const here = await Promise.all(group.here_ids.map(getChatMember))
        group.here_ids.pull(...here.filter(isKicked).map(getId))
        return group.save()
    }

    function getChatMember(id: number) {
        return bot.getChatMember(group.id, '' + id)
    }
}

async function updateText(
        bot: Enhancer.TelegramBot, group: DataBase.Group.Document, locale: Locale,
        chat_id: number, message_id: number
) {
    return bot.editMessageText(locale.messageTexts.group.members(await getNames(group.here_ids)), {
        chat_id, message_id,
        reply_markup: membersReplyMarkup(locale)
    })
}

function isKicked({ status }: import('node-telegram-bot-api').ChatMember) {
    return status == 'kicked'
}

function getId({ user }: import('node-telegram-bot-api').ChatMember) {
    return user.id
}
