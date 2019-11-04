import { DataBase } from './db';
export * from './db';

export default function DB(): DataBase {
    return {
        name: async id => '',
        updateUser: async user => {},
        debts: async id => []
    };
};
