import dataBase from '#/database/DataBase'

export function alwaysUseMarkdown(this: Enhancer.TelegramBot) {
    const oldSendMessage = this.sendMessage.bind(this)
    this.sendMessage = (chatId, text, options) =>
        oldSendMessage(chatId, text, { ...options, parse_mode: 'Markdown' })
}

function updateUser({ from }: { from: import('node-telegram-bot-api').User }) {
    dataBase.userPiece.updateUser(from)
}

export function alwaysUpdateUser(this: Enhancer.TelegramBot) {
    this.on('message', ({ from }) => {
        if (from) {
            dataBase.userPiece.updateUser(from)
        }
    })
    this.on('inline_query', updateUser)
    this.on('chosen_inline_result', updateUser)
    this.on('callback_query', updateUser)
}
