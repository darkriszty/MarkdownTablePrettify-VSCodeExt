import { IAlignmentMarker } from ".";

export class LeftAlignmentMarker implements IAlignmentMarker {
    constructor() {
    }
    public mark(padding: string): string {
        if (padding == null || padding.length < 2)
            return padding;
        return ":" + padding.substr(1);
    }
}