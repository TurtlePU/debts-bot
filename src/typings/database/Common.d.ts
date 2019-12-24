declare namespace DataBase {
    /**
     * Plain Mongoose document
     */
    type Document = import('mongoose').Document
    /**
     * Classic document query
     */
    type DocumentQuery<T> = import('mongoose').DocumentQuery<T | null, T>
    /**
     * Plain Mongoose array
     */
    type MongoArray<T> = import('mongoose').Types.Array<T>
    /**
     * Plain Mongoose map
     */
    type MongoMap<T> = import('mongoose').Types.Map<T>
}
