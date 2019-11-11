import { InlineHandler } from './inline_handler'
export * from './inline_handler'

import debt from './debt'
import settleUp from './settle_up'

export default <InlineHandler[]> [ debt, settleUp ]
