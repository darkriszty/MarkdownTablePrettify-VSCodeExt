export interface ILogger {
    logInfo(message: string): void;
    logError(error: Error | string): void;
}