import groupDebtReplyMarkup from './GroupDebtReplyMarkup'
import getNames from './GetNames'

export default async function(bot: Enhancer.TelegramBot, chat_id: number, message_id: number,
        offer: DataBase.Offer.Types.Group, locale: Locale) {
    const text = locale.group.offer(
        offer.debt.amount, offer.debt.currency,
        await getNames(offer.group.payer_ids), await getNames(offer.group.member_ids)
    )
    return bot.editMessageText(text, {
        chat_id, message_id, reply_markup: groupDebtReplyMarkup(locale)
    })
}
