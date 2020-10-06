import { SizeLimitChecker } from "./sizeLimitChecker";

export class NoSizeLimitChecker implements SizeLimitChecker {
    public isWithinAllowedSizeLimit(_: string): boolean {
        return true;
    }
}