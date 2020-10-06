import { ILogger } from "../../diagnostics/logger";
import { SizeLimitChecker } from "./sizeLimitChecker";

export class ConfigSizeLimitChecker implements SizeLimitChecker {
    constructor(
        private readonly _loggers: ILogger[],
        private readonly _maxTextLength: number
    ){}

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