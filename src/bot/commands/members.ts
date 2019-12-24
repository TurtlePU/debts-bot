import groupModel from '#/database/models/Group'
import userModel  from '#/database/models/User'

import getLocale from '#/locale/Locale'

import {
    isDefined
} from '#/util/Predicates'

const command: Enhancer.Command = {
    key: /\/members/u,
    async callback(msg) {
        const locale = getLocale(msg.from?.language_code)
        let message: string
        if (msg.chat.type == 'group' || msg.chat.type == 'supergroup') {
            message = locale.group.members(await getNames(msg.chat.id))
        } else {
            message = locale.group.notGroup
        }
        return this.sendMessage(msg.chat.id, message)
    }
}

export default command

async function getNames(group_id: number) {
    const group = await groupModel.makeOrGetGroup(group_id)
    const users = await Promise.all(group.members.map(({ _id }) => userModel.getUser(_id)))
    return users.filter(isDefined).map(({ name }) => name)
}
