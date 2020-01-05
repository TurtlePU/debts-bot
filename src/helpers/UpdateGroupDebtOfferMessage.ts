import inlineKeyboard from '#/util/InlineKeyboard'

import getNames from './GetNames'

import {
    group_debt_lock,
    group_debt_cancel
} from '#/bot/Constants'

export default async function(bot: Enhancer.TelegramBot, chat_id: number, message_id: number,
        { debt, group }: DataBase.Offer.Outputs['group'], { messageTexts, buttons }: Locale) {
    return bot.editMessageText(
        messageTexts.group.offer(
            debt.amount, debt.currency,
            await getNames(group.payer_ids),
            await getNames(group.member_ids)
        ),
        {
            chat_id, message_id,
            reply_markup: keyboard(buttons)
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
