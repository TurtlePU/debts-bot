import { DataBase } from './db';
export { DataBase } from './db';

export default function DB(): DataBase {
    return {
        name: async id => '',
        updateUser: async user => {},
    };
};
