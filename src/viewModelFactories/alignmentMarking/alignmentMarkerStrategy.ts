import { Alignment } from "../../models/alignment";
import { IAlignmentMarker, LeftAlignmentMarker, RightAlignmentMarker, CenterAlignmentMarker, NotSetAlignmentMarker } from ".";

export class AlignmentMarkerStrategy {
    private readonly _leftMarker: IAlignmentMarker;
    private readonly _rightMarker: IAlignmentMarker;
    private readonly _centerMarker: IAlignmentMarker;
    private readonly _notSetMarker: IAlignmentMarker;

    constructor(private _markerChar: string) {
        this._leftMarker = new LeftAlignmentMarker(this._markerChar);
        this._rightMarker = new RightAlignmentMarker(this._markerChar);
        this._centerMarker = new CenterAlignmentMarker(this._markerChar);
        this._notSetMarker = new NotSetAlignmentMarker();
    }

    public markerFor(alignment: Alignment): IAlignmentMarker {
        switch (alignment) {
            case Alignment.Left: return this._leftMarker;
            case Alignment.Right: return this._rightMarker;
            case Alignment.Center: return this._centerMarker;
            default: return this._notSetMarker;
        }
    }
}