import { Alignment } from "../models/alignment";

export class AlignmentMarkerStrategy {

    public marker(alignment: Alignment): IMarker {
        switch (alignment) {
            case Alignment.Left: return new LeftMarker();
            case Alignment.Right: return new RightMarker();
            case Alignment.Center: return new CenterMarker();
            default: return new NoOpMarker();
        }
    }
}

export interface IMarker {
    mark(padding: string): string;
}

export class NoOpMarker implements IMarker {
    public mark(padding: string): string {
        return padding;
    }
}

export class LeftMarker implements IMarker {
    public mark(padding: string): string {
        return ":" + padding.substr(1);
    }
}

export class RightMarker implements IMarker {
    public mark(padding: string): string {
        return padding.substring(0, padding.length - 1) + ":";
    }
}

export class CenterMarker implements IMarker {
    public mark(padding: string): string {
        return ":" + padding.substring(1, padding.length - 1) + ":";
    }
}