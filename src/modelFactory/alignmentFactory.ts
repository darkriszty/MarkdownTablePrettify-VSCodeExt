import { Alignment } from "../models/alignment";

export class AlignmentFactory {

    public createAlignments(cells: string[]): Alignment[] {
        return cells.map(this.alignmentOf);
    }

    private alignmentOf(cell: string): Alignment {
        const left = cell[0] == ":";
        const right = cell[cell.length - 1] == ":";

        if (left && right) return Alignment.Center;
        if (right) return Alignment.Right;
        if (left) return Alignment.Left;

        return Alignment.NotSet;
    }
}