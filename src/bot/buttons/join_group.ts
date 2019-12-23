import groupModel from '#/database/models/Group'
import getLocale from '#/locale/Locale'

import {
    group_join
} from '#/bot/Constants'

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
    const group = await groupModel.getGroup(query.message.chat.id)
    group?.member_ids.push(query.from.id)
    group?.save()
}
