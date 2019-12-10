const me = {
    value: {} as import('node-telegram-bot-api').User
}

export function getMe() {
    return me.value
}

export function connect(bot: import('node-telegram-bot-api'), url: string, token: string) {
    return async () => {
        await bot.setWebHook(`${url}/bot${token}`)
        me.value = await bot.getMe()
    }
}
