import 'module-alias/register';

import https from 'https';

import Bot from '@bot';
import DB from '@db';

(function start() {
    const port = +(process.env.PORT || '8080');
    const url = process.env.URL || 'none';
    const token = process.env.TOKEN || 'none';

    const db = DB();

    const bot = Bot(token, port, db);
    bot.setWebHook(`${url}/bot${token}`);

    setInterval(() => https.get(url), 1000 * 60 * 15);
})();
