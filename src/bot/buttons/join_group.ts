import getLocale from '#/locale/Locale'
import { group_join } from '../Constants'

const listener: Enhancer.OnClick = {
    key: group_join,
    callback(query) {
        const text = getLocale(query.from.language_code).join.success
        return { text }
    }
}

export default listener
