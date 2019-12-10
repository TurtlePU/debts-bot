export function simple(commandProto: CommandProto): Command {
    return command({}, commandProto)
}

export function command<MType>(requirements: MType, cmnd: CommandProto<MType>): Command<MType> {
    return { ...cmnd, requirements }
}
