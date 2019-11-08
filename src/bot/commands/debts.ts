import TelegramBot from 'node-telegram-bot-api';

import { command } from './helper';

export default command(
    {
        from: {} as TelegramBot.User
    },
    {
        regexp: /\/debts/,
        callback(dataBase) {
            return async ({ msg, locale }) =>
                this.sendMessage(msg.chat.id, locale.debts(await dataBase.debts(msg.from.id)))
        }
    }
);
