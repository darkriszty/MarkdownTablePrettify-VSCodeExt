import { Alignment } from "../../models/alignment";
import { IAlignmentMarker, LeftAlignmentMarker, RightAlignmentMarker, CenterAlignmentMarker, NotSetAlignmentMarker } from ".";


export class AlignmentMarkerStrategy {
    constructor(private _markerChar: string) { }

    public markerFor(alignment: Alignment): IAlignmentMarker {
        switch (alignment) {
            case Alignment.Left: return new LeftAlignmentMarker(this._markerChar);
            case Alignment.Right: return new RightAlignmentMarker(this._markerChar);
            case Alignment.Center: return new CenterAlignmentMarker(this._markerChar);
            default: return new NotSetAlignmentMarker();
        }
    }
}