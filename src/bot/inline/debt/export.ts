import requestPiece from './handler'
import resultPiece from './feedback'

import accept from './buttons/accept'
import decline from './buttons/decline'

const handler: Inline.Handler = {
    requestPiece,
    resultPiece,
    keyboard: [ accept, decline ]
}

export default handler
