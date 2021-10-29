import { CliOptions } from "./cliOptions";

export function parseArguments(processArgs: string[]): CliOptions {
    return <CliOptions> {
        check: Boolean(hasArgument(ArgumentNames.CHECK_ARG) || false),
        columnPadding: Number(getArgumentValue(ArgumentNames.PADDING_ARG) || 0)
    };

    function hasArgument(key: string): boolean {
        return processArgs.length > 2 && processArgs.find(arg => arg.startsWith("--" + key)) !== undefined;
    }

    function getArgumentValue(key: string): string {
        const hasArguments = processArgs.length > 2;
        const split = (hasArguments
            ? processArgs.find(arg => arg.startsWith("--" + key)) || ""
            : "")
            .split("=");

        return split.length == 2
            ? split[1]
            : null;
    }
}

class ArgumentNames {
    public static readonly CHECK_ARG : string = "check";
    public static readonly PADDING_ARG : string = "columnPadding";
}