import userPiece from '#/database/models/User'

import { log } from '#/util/Log'

/**
 * Forces bot to update user in database on each interaction of Telegram user with a bot
 */
export default function(this: Enhancer.TelegramBot) {
    this.on('message', updateUser)
    this.on('inline_query', updateUser)
    this.on('chosen_inline_result', updateUser)
    this.on('callback_query', updateUser)
}

function updateUser({ from }: { from?: Enhancer.User }) {
    if (from) {
        userPiece.updateUser(from).catch(log)
    }
}
