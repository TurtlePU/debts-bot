import { getUserName } from '#/util/StringUtils'
import { command } from '#/util/CommandBuilder'

export default command(
    {
        from: {} as import('node-telegram-bot-api').User
    },
    {
        regexp: /\/start/u,
        callback() {
            return ({ msg, locale }) =>
                this.sendMessage(msg.chat.id, locale.hi(getUserName(msg.from)))
        }
    }
)
