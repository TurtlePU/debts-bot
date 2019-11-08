import { InlineHandler } from './inline_handler';

const handler: InlineHandler = {
    regexp: /.*/,
    async onInline(query) {
        //
        return [];
    }
};

export default handler;
