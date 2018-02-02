import { ILogger } from "./logger";

export class ConsoleLogger implements ILogger {

    logInfo(message: string): void {
        console.log(message);
    }

    logError(error: string | Error): void {
        console.error(error);
    }
}