import userModel  from '#/database/models/User'

import {
    isDefined
} from '#/util/Predicates'

/**
 * Gets names of users saved in group document
 * @param group 
 */
export default async function(group: DataBase.Group.Document) {
    const users = await Promise.all([ ...group.members.keys() ].map(id => userModel.getUser(+id)))
    return users.filter(isDefined).map(({ name }) => name)
}
