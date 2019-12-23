declare namespace DataBase {
    type Group = {
        _id: number
        message_id: number
        locale_code?: string
        member_ids: MongoArray<number>
    }
    namespace Group {
        type Document = DataBase.Document & Group
        type Model = {
            makeGroup(id: number, message_id: number, locale: string | undefined): Promise<Document>
            getGroup(id: number): DocumentQuery<Document>
        }
    }
}
