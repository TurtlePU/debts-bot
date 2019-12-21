export function UseMarkdown(this: Enhancer.TelegramBot) {
    const oldSendMessage = this.sendMessage.bind(this)
    this.sendMessage = (chatId, text, options) =>
        oldSendMessage(chatId, text, { ...options, parse_mode: 'Markdown' })
}

export function UpdateUser(userPiece: UserPiece) {
    const updater = ({ from }: { from: import('node-telegram-bot-api').User }) =>
        userPiece.updateUser(from)
    return function (this: Enhancer.TelegramBot) {
        this.on('message', ({ from }) => {
            if (from) {
                updater({ from })
            }
        })
        this.on('inline_query', updater)
        this.on('chosen_inline_result', updater)
        this.on('callback_query', updater)
    }
}
