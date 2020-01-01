import {
    group_debt_lock
} from '#/bot/Constants'

export default function(locale: Locale): import('node-telegram-bot-api').InlineKeyboardMarkup {
    return {
        inline_keyboard: [
            [ {
                text: locale.buttons.joinPayers,
                callback_data: 'group.debt.payers.join'
            }, {
                text: locale.buttons.leavePayers,
                callback_data: 'group.debt.payers.leave'
            } ],
            [ {
                text: locale.buttons.joinMembers,
                callback_data: 'group.debt.members.join'
            }, {
                text: locale.buttons.leaveMembers,
                callback_data: 'group.debt.members.leave'
            } ],
            [ {
                text: locale.buttons.lockOffer,
                callback_data: group_debt_lock
            } ]
        ]
    }
}
