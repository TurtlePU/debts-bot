declare namespace DataBase {
    /**
     * Plain Mongoose document
     */
    type Document = import('mongoose').Document
    /**
     * Plain Mongoose document query
     */
    type DocumentQuery<T> = import('mongoose').DocumentQuery<T | null, T>
    type MongoArray<T> = import('mongoose').Types.Array<T>
    type MongoMap<T> = import('mongoose').Types.Map<T>
}
