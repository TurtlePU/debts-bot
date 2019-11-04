import 'module-alias/register';

import https from 'https';

import Bot from '@bot';
import DB from '@db';
import Locale from '@locale';

(function start() {
    const url = process.env.URL || 'none';
    const port = +(process.env.PORT || '8080');
    const token = process.env.TOKEN || 'none';

    const db = DB();

    const bot = Bot(token, port, Locale, db);
    bot.setWebHook(url);

    setInterval(() => https.get(url), 1000 * 60 * 15);
})();
