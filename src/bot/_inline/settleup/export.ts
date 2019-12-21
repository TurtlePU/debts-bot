import resultPiece from './OnChosenResult'
import requestPiece from './OnInline'

import accept from './keyboard/accept'
import decline from './keyboard/decline'

const handler: Inline.Handler = {
    requestPiece,
    resultPiece,
    keyboard: [ accept, decline ]
}

export default handler
