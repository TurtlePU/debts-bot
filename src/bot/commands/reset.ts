import debtModel from '#/database/models/Debt'

import getLocale from '#/locale/Locale'

import { isGroup } from '#/util/Predicates'

const command: Enhancer.Command = {
    key: /\/reset/u,
    async callback({ chat, from }) {
        const { messageTexts } = getLocale(from?.language_code)
        if (isGroup(chat)) {
            await debtModel.clearGroupDebts(chat.id)
            return this.sendMessage(chat.id, messageTexts.group.debtsCleared)
        } else {
            return this.sendMessage(chat.id, messageTexts.wrongChatForDebt)
        }
    }
}

export default command
