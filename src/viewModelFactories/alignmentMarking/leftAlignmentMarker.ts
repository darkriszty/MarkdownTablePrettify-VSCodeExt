import { IAlignmentMarker } from ".";

export class LeftAlignmentMarker implements IAlignmentMarker {
    constructor(private _markerChar: string) { }

    public mark(padding: string): string {
        if (padding == null || padding.length < 2)
            return padding;
        return this._markerChar + padding.substr(1);
    }
}