import 'module-alias';

import https from 'https';

import Bot from '@bot';
import Locale from '@locale';

(function start() {
    const url = process.env.URL || 'none';
    const token = process.env.TOKEN || 'none';

    const bot = Bot(token, Locale);
    bot.setWebHook(url);

    setInterval(() => https.get(url), 1000 * 60 * 15);
})();
