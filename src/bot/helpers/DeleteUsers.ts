/**
 * Delete users (TODO: move group balances to debts)
 * @param group
 * @param member_ids
 */
export default function(group: DataBase.Group.Document, member_ids: number[]) {
    for (const id of member_ids) {
        group.members.delete('' + id)
    }
    return group.save()
}
