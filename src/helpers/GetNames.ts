import userModel  from '#/database/models/User'

import {
    isDefined
} from '#/util/Predicates'

/**
 * Gets names of users by their ids
 * @param ids list of IDs of users
 */
export default async function(ids: number[]) {
    const users = await Promise.all(ids.map(id => userModel.getUser(id)))
    return users.filter(isDefined).map(({ name }) => name)
}
