import inlineKeyboard from '#/util/InlineKeyboard'

import getNames from './GetNames'

import {
    group_debt_lock,
    group_debt_cancel
} from '#/bot/Constants'

export default async function(bot: Enhancer.TelegramBot, chat_id: number, message_id: number,
        offer: DataBase.Offer.Outputs['group'], locale: Locale) {
    return bot.editMessageText(
        locale.messageTexts.group.offer(
            offer.debt.amount, offer.debt.currency,
            await getNames(offer.group.payer_ids), await getNames(offer.group.member_ids)
        ),
        {
            chat_id, message_id,
            reply_markup: keyboard(locale.buttons)
        }
    )
}

function keyboard({
    joinPayers, leavePayers,
    joinMembers, leaveMembers,
    lockOffer, cancelOffer
}: Locale['buttons']) {
    return inlineKeyboard([ [
        [ joinPayers, 'group.debt.payers.join' ],
        [ leavePayers, 'group.debt.payers.leave' ]
    ], [
        [ joinMembers, 'group.debt.members.join' ],
        [ leaveMembers, 'group.debt.members.leave' ]
    ], [
        [ lockOffer, group_debt_lock ],
        [ cancelOffer, group_debt_cancel ]
    ] ])
}
