import { InlineHandler, FeedbackPiece, ButtonPiece } from '../inline_handler'

import feedbackPiece from './feedback'
import inlineHandler from './handler'

import accept from './buttons/accept'
import decline from './buttons/decline'

const handler: InlineHandler & FeedbackPiece & ButtonPiece = {
    ...inlineHandler,
    ...feedbackPiece,
    buttons: [ accept, decline ]
}

export default handler
