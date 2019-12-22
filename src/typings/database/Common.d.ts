declare namespace DataBase {
    type Document = import('mongoose').Document
    type DocumentQuery<T, DocType, QueryHelpers = {}> =
        import('mongoose').DocumentQuery<T, DocType, QueryHelpers>
}
