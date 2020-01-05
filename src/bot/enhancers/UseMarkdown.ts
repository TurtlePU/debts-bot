/**
 * Switches default parse mode of all bot messages to Markdown
 */
export default function(this: Enhancer.TelegramBot) {
    const sendMessage = this.sendMessage.bind(this)
    this.sendMessage = (chatId, text, options) =>
        sendMessage(chatId, text, { parse_mode: 'Markdown', ...options })

    const editMessageText = this.editMessageText.bind(this)
    this.editMessageText = (text, options) =>
        editMessageText(text, { parse_mode: 'Markdown', ...options })
}
