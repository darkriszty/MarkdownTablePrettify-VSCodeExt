import { IAlignmentMarker } from ".";

export class RightAlignmentMarker implements IAlignmentMarker {
    public mark(padding: string): string {
        if (padding == null || padding.length < 2)
            return padding;
        return padding.substring(0, padding.length - 1) + ":";
    }
}