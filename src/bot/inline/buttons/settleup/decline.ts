import {
    inline_settleup_decline
} from '#/bot/Constants'

import {
    declineOffer
} from '#/util/FallbackAnswers'

const onClick: Enhancer.Inline.OnClick = {
    key: inline_settleup_decline,
    callback: declineOffer
}

export default onClick
