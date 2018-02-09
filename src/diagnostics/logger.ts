export interface ILogger {
    setEnabled(enabled: boolean): void;
    logInfo(message: string): void;
    logError(error: Error | string): void;
}