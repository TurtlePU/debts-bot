import ru from './ru'

const locales = new Map([ [ 'ru', ru ] ])
const defLocale = ru

export default function getLocale(localeCode?: string): Locale {
    if (localeCode) {
        return locales.get(localeCode) ?? defLocale
    } else {
        return defLocale
    }
}
