import inlineKeyboard from '#/util/InlineKeyboard'

import {
    group_join,
    group_update_members
} from '#/bot/Constants'

/**
 * Reply markup below `/members` response
 * @param locale 
 */
export default function(locale: Locale) {
    return inlineKeyboard([ [
        [ locale.buttons.join, group_join ],
        [ locale.buttons.updateMembers, group_update_members ]
    ] ])
}
