import { Command } from './command'
export * from './command'

import start from './start'
import debts from './debts'

export default <Command<any>[]> [ start, debts ]
