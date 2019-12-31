export function groupOfferId(chat_id: number, message_id: number) {
    return `group:${chat_id}:${message_id}`
}

export function inlineOfferId(message_id: string) {
    return `inline:${message_id}`
}
