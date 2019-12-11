import { command } from '#/util/CommandBuilder'

export default command(
    {
        from: {} as import('node-telegram-bot-api').User
    },
    {
        regexp: /\/debts/u,
        callback(dataBase) {
            const debtsGetter = getFormattedDebts(dataBase)
            return async ({ msg, locale }) =>
                this.sendMessage(msg.chat.id, locale.debts(await debtsGetter(msg.from.id)))
        }
    }
)

function getFormattedDebts({ debtPiece, userPiece }: DataBase) {
    const mapper = fromInnerToFormatted(userPiece)
    return async (id: number) => {
        const debts = await debtPiece.getDebts(id)
        return Promise.all(debts.map(mapper))
    }
}

function fromInnerToFormatted(userPiece: DataBase.User.Piece) {
    return async ({ to, ...info }: DataBase.Debt.Value) => {
        const toUser = await userPiece.getUser(to)
        if (!toUser) {
            throw new Error('Name of bot user not found in database')
        }
        return {
            to: toUser.name, ...info
        }
    }
}
