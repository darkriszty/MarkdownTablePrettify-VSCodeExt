export interface SizeLimitChecker {
    isWithinAllowedSizeLimit(text: string): boolean;
}