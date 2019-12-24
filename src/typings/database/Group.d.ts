declare namespace DataBase {
    type Group = {
        _id: number
        members: MongoArray<Group.Member>
    }
    namespace Group {
        type Balance = {
            amount: number
            currency: string
        }
        type Member = {
            _id: number
            balance: MongoArray<Balance>
        }
        type Document = DataBase.Document & Group
        type Model = {
            makeOrGetGroup(id: number): Promise<Document>
            getGroup(id: number): DocumentQuery<Document>
            addMembers(group: Document, members: Enhancer.User[]): Promise<Document>
            removeMember(group: Document, member_id?: number): Promise<Document>
        }
    }
}
