import { ILogger } from "./logger";
import { BaseLogger } from "./baseLogger";

export class ConsoleLogger extends BaseLogger implements ILogger {

    public logInfo(message: string): void {
        super.logIfEnabled(console.log, message);
    }

    public logError(error: string | Error): void {
        super.logIfEnabled(console.error, error);
    }
}