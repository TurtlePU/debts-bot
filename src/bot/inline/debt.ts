import { InlineHandler, CallbackPiece, FeedbackPiece } from './inline_handler';

const handler: InlineHandler & CallbackPiece & FeedbackPiece = {
    id: 'debt',
    regexp: /-?\d+/,
    async onInline(query, match) {
        const amount = BigInt(match[0]);
        //
        return [];
    },
    onInlineResult(result) {
        //
    },
    onInlineCallbackQuery(query) {
        //
    }
};

export default handler;
