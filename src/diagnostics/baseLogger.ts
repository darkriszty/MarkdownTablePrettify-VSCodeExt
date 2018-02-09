import { ILogger } from "./logger";

export abstract class BaseLogger implements ILogger {
    private _enabled: boolean = true;

    public setEnabled(enabled: boolean): void {
        this._enabled = enabled;
    }

    public abstract logInfo(message: string): void;
    public abstract logError(error: string | Error): void;

    protected logIfEnabled(logFunc: (any) => void, param: string | Error): void {
        if (!this._enabled) return;
        logFunc(param);
    }
}