import resultPiece from './feedback'
import requestPiece from './handler'

import accept from './buttons/accept'
import decline from './buttons/decline'

const handler: Inline.Handler = {
    requestPiece,
    resultPiece,
    keyboard: [ accept, decline ]
}

export default handler
