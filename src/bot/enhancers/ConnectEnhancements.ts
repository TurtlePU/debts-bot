import Enhancer from '#/enhancer/Enhancer'

import alwaysUpdateUser  from './UpdateUser'
import alwaysUseMarkdown from './UseMarkdown'

import deleteLeftUser from './group/DeleteLeft'
import greetNewGroup  from './group/GreetNewGroup'

/**
 * Connects various enhancements to bot
 */
export default function(this: Enhancer) {
    this.enhance(alwaysUpdateUser)
        .enhance(alwaysUseMarkdown)
        .enhance(deleteLeftUser)
        .enhance(greetNewGroup)
}
