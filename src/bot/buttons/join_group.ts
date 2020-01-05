import groupModel from '#/database/models/Group'

import getLocale from '#/locale/Locale'

import { group_join } from '#/bot/Constants'

/**
 * Adds user to group document on click
 */
const listener: Enhancer.OnClickStrict = {
    key: group_join,
    async callback(query) {
        const group = await groupModel.makeOrGetGroup(query.message.chat)
        group.here_ids.addToSet(query.from.id)
        await group.save()
        return { text: getLocale(query.from.language_code).response.joinSuccess }
    }
}

export default listener
