import groupModel from '#/database/models/Group'

import getLocale from '#/locale/Locale'

import { group_join } from '#/bot/Constants'

/**
 * Adds user to group document on click
 */
const listener: Enhancer.OnClickStrict = {
    key: group_join,
    async callback({ from, message }) {
        const group = await groupModel.makeOrGetGroup(message.chat)
        if (group.here_ids.includes(from.id)) {
            // TODO: Move to Locale
            return { text: 'Already joined' }
        }
        group.here_ids.push(from.id)
        await group.save()
        return { text: getLocale(from.language_code).response.joinSuccess }
    }
}

export default listener
