import groupModel from '#/database/models/Group'
import getLocale from '#/locale/Locale'

import {
    group_join
} from '#/bot/Constants'

/**
 * Adds user to group document on click
 */
const listener: Enhancer.OnClick = {
    key: group_join,
    callback(query) {
        pushUser(query)
        const text = getLocale(query.from.language_code).join.success
        return { text }
    }
}

export default listener

async function pushUser(query: Enhancer.ClickEvent) {
    const group = await groupModel.makeOrGetGroup(query.message.chat.id)
    return groupModel.addMembers(group, [ query.from ])
}
