import { Alignment } from "../../models/alignment";
import { IAlignmentMarker, LeftAlignmentMarker, RightAlignmentMarker, CenterAlignmentMarker, NotSetAlignmentMarker } from ".";


export class AlignmentMarkerStrategy {

    public markerFor(alignment: Alignment): IAlignmentMarker {
        switch (alignment) {
            case Alignment.Left: return new LeftAlignmentMarker();
            case Alignment.Right: return new RightAlignmentMarker();
            case Alignment.Center: return new CenterAlignmentMarker();
            default: return new NotSetAlignmentMarker();
        }
    }
}