declare type Bound<T> = (
    this: import('node-telegram-bot-api'),
    dataBase: DataBase, getMe: () => import('node-telegram-bot-api').User
) => T

declare type MaybePromise<T> = T | Promise<T>

declare type Identifiable<U, V = U> = ({ key: string } & U) | ({ key: RegExp } & V)
