import { ILogger } from "../diagnostics/logger";

export class SizeLimitChecker {
    constructor(
        private readonly _loggers: ILogger[],
        private readonly _maxTextLength: number
    ){}

    public get maxTextLength() : number {
        return this._maxTextLength;
    }

    public isWithinAllowedSizeLimit(text: string): boolean {
        const whithinLimit = text.length <= this._maxTextLength;
        this.logWhenTooBig(whithinLimit);
        return whithinLimit;
    }

    private logWhenTooBig(whithinLimit: boolean) {
        if (!whithinLimit) {
            this._loggers.forEach(_ => _.logInfo(`Skipped markdown table prettifying due to text size limit. Configure this in the extension settings (current limit: ${this._maxTextLength} chars).`));
        }
    }
}