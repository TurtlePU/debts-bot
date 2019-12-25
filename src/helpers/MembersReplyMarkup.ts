import {
    group_join, group_update_members
} from '#/bot/Constants'

/**
 * Reply markup below `/members` response
 * @param locale 
 */
export default function(locale: Locale) {
    return {
        reply_markup: {
            inline_keyboard: [ [ {
                text: locale.buttons.join,
                callback_data: group_join
            }, {
                text: locale.buttons.updateMembers,
                callback_data: group_update_members
            } ] ]
        }
    }
}
