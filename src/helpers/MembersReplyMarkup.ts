import inlineKeyboard from '#/util/InlineKeyboard'

import {
    group_join,
    group_update_members
} from '#/bot/Constants'

/**
 * Reply markup below `/members` response
 */
export default function({ buttons }: Locale) {
    return inlineKeyboard([ [
        [ buttons.join, group_join ],
        [ buttons.updateMembers, group_update_members ]
    ] ])
}
