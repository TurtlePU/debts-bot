import ru from './ru';

const locales = new Map([ [ 'ru', ru ] ]);
const defLocale = ru;

export default function getLocale(localeCode?: string): Locale {
    return (localeCode && locales.get(localeCode)) || defLocale;
};
