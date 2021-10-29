import { CliOptions } from "../../cli/cliOptions";
import { readFileContents } from "./systemTestFileReader";

interface ISystemTestsConfig {
    cliIgnoreFiles: string[];
    columnPadding: Map<string, number>;
}

const reviver = function(key: string, value: any): any {
    if (key === "columnPadding") {
        return new Map(Object.entries(value));
    }
    return value;
}

export default class SystemTestsConfig {
    private static _config: ISystemTestsConfig = JSON.parse(readFileContents("_systemTests.json"), reviver);

    public static isAllowedForCliTests(fileName: string): boolean {
        return SystemTestsConfig._config.cliIgnoreFiles.indexOf(fileName) < 0;
    }

    public static getColumnPaddingFor(fileNameRoot: string): number {
        return Number(SystemTestsConfig._config.columnPadding.get(fileNameRoot) || 0);
    }

    public static getCliOptionsFor(fileNameRoot: string): CliOptions {
        return <CliOptions> {
            check: false,
            columnPadding: SystemTestsConfig.getColumnPaddingFor(fileNameRoot)
        };
    }
}