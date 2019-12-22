import ru from './ru'

const locales = new Map([ [ 'ru', ru ] ])
const defLocale = ru

/**
 * @param localeCode locale code of user
 * @returns suitable locale for a user (or a default one)
 */
export default function getLocale(localeCode?: string): Locale {
    if (localeCode) {
        return locales.get(localeCode) ?? defLocale
    } else {
        return defLocale
    }
}
