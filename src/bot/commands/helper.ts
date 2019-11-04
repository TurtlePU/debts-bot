import { CommandProto, Command } from "./command";

export function simple(commandProto: CommandProto): Command {
    return command({}, commandProto);
}

export function command<MType>(requirements: MType, command: CommandProto<MType>): Command<MType> {
    return { ...command, requirements };
}
