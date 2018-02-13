import { IAlignmentMarker } from ".";

export class RightAlignmentMarker implements IAlignmentMarker {
    constructor(private _markerChar: string) { }

    public mark(padding: string): string {
        if (padding == null || padding.length < 2)
            return padding;
        return padding.substring(0, padding.length - 1) + this._markerChar;
    }
}