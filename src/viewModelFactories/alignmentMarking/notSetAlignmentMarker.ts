import { IAlignmentMarker } from "./alignmentMarker";

export class NotSetAlignmentMarker implements IAlignmentMarker {
    public mark(padding: string): string {
        return padding;
    }
}