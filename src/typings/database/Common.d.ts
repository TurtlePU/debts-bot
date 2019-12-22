declare namespace DataBase {
    /**
     * Plain Mongoose document
     */
    type Document = import('mongoose').Document
    /**
     * Plain Mongoose document query
     */
    type DocumentQuery<T, DocType, QueryHelpers = {}> =
        import('mongoose').DocumentQuery<T, DocType, QueryHelpers>
}
