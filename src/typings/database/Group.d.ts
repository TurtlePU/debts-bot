declare namespace DataBase {
    type Group = {
        _id: number
        members: MongoMap<MongoMap<number>>
    }
    namespace Group {
        type Document = DataBase.Document & Group
        type Model = {
            makeOrGetGroup(id: number): Promise<Document>
            getGroup(id: number): DocumentQuery<Document>
            addMembers(group: Document, members: Enhancer.User[]): Promise<Document>
            removeMember(group: Document, member_id?: number): Promise<Document>
        }
    }
}
