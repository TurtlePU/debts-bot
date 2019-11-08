import TelegramBot from 'node-telegram-bot-api';

import commands from '@commands';
import Locale from '@locale';
import handlers from './inline/export';
import { DataBase } from '@db';
import ConnectCommands from './command_controller';
import ConnectInline from './inline_controller';

export default function Bot(token: string, port: number, dataBase: DataBase): TelegramBot {
    const bot = new TelegramBot(token, { webHook: { port } });

    const oldSendMessage = bot.sendMessage.bind(bot);
    bot.sendMessage = (chatId, text, options) =>
        oldSendMessage(chatId, text, { ...options, parse_mode: 'Markdown' });

    ConnectCommands({ bot, dataBase, commands, Locale });

    ConnectInline(bot, handlers);

    return bot;
};
