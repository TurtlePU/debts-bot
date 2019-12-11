export function simple(commandProto: Command.Proto): Command {
    return command({}, commandProto)
}

export function command<MType>(requirements: MType, cmnd: Command.Proto<MType>): Command<MType> {
    return { ...cmnd, requirements }
}
