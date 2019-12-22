import userPiece from '#/database/models/User'

import log from '#/util/Log'

/**
 * Switches parse mode of all bot messages to Markdown
 */
export function alwaysUseMarkdown(this: Enhancer.TelegramBot) {
    const oldSendMessage = this.sendMessage.bind(this)
    this.sendMessage = (chatId, text, options) =>
        oldSendMessage(chatId, text, { ...options, parse_mode: 'Markdown' })
}

function updateUser({ from }: { from: import('node-telegram-bot-api').User }) {
    userPiece.updateUser(from).catch(log)
}

/**
 * Forces bot to update user in database on each interaction of Telegram user with a bot
 */
export function alwaysUpdateUser(this: Enhancer.TelegramBot) {
    this.on('message', ({ from }) => {
        if (from) {
            userPiece.updateUser(from).catch(log)
        }
    })
    this.on('inline_query', updateUser)
    this.on('chosen_inline_result', updateUser)
    this.on('callback_query', updateUser)
}
