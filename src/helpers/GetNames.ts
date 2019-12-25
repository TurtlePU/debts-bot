import userModel  from '#/database/models/User'

import {
    isDefined
} from '#/util/Predicates'

/**
 * Gets names of users saved in group document
 * @param group 
 */
export default async function(group: DataBase.Group.Document) {
    const users = await Promise.all(group.here_ids.map(userModel.getUser))
    return users.filter(isDefined).map(({ name }) => name)
}