import {
    inline_debt_decline
} from '#/bot/Constants'

import {
    declineOffer
} from '#/util/FallbackAnswers'

/**
 * Declines debt offer on click
 */
const onClick: Enhancer.Inline.OnClick = {
    key: inline_debt_decline,
    callback: declineOffer
}

export default onClick
