/** Key of an 'accept' button of debt offer */
export const inline_debt_accept = 'offer.accept'
/** Key of a 'decline' button of debt offer */
export const inline_debt_decline = 'offer.decline'
/** RegExp which fits debt offer queries & debt offer article ids */
export const inline_debt_regexp = /^(-?\d{1,9})\s*([^\s\d].{0,99})?$/u
/** Key of an 'accept' button of settle up offer */
export const inline_settleup_accept = 'settleUp.accept'
/** Key of a 'decline' button of settle up offer */
export const inline_settleup_decline = 'settleUp.decline'
/** Article ID of settleup offers */
export const inline_settleup_article_id = 'settle-up'
/** Key of a 'join' button in group */
export const group_join = 'group.join'
/** Key of 'update members' button in group */
export const group_update_members = 'group.updateMembers'
/** 'Debt' command */
export const group_debt_regexp = inline_debt_regexp
/** RegExp for buttons below group debt offer message */
export const group_debt_button_regexp = /^group\.debt\.(payers|members)\.(join|leave)$/u
