import { InlineHandler, ButtonPiece, FeedbackPiece } from '../inline_handler'

import inlineHandler from './handler'
import feedbackPiece from './feedback'

import accept from './buttons/accept'
import decline from './buttons/decline'

const handler: InlineHandler & ButtonPiece & FeedbackPiece = {
    ...inlineHandler,
    ...feedbackPiece,
    buttons: [ accept, decline ]
}

export default handler
