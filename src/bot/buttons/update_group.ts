import getLocale from '#/locale/Locale'

import {
    group_update_members
} from '#/bot/Constants'

const listener: Enhancer.OnClick = {
    key: group_update_members,
    callback(query) {
        return {
            text: getLocale(query.from.language_code).response.membersUpdated
        }
    }
}

export default listener
