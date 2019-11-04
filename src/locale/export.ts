import ru from './ru';

const locales = new Map([ [ 'ru', ru ] ]);
const noLocale = ru;

export default function getLocale(localeCode: string | undefined): Locale {
    return locales.get(localeCode || '') || noLocale;
};
