import { group_debt_regexp } from '#/bot/Constants'
import getLocale from '#/locale/Locale'
import { isGroup } from '#/util/Predicates'

const command: Enhancer.Command = {
    key: group_debt_regexp,
    callback(msg) {
        const locale = getLocale(msg.from?.language_code)
        if (isGroup(msg.chat)) {
            // const amount = +match[1]
            // const currency = match[2] ?? locale.currency
            //
        } else {
            return this.sendMessage(msg.chat.id, locale.wrongChatForDebt)
        }
    }
}

export default command
