import { Alignment } from "../models/alignment";

export class AlignmentFactory {
    public createAlignments(cells: string[]): Alignment[] {
        let result: Alignment[] = [];

        const len: number = cells.length;
        for (let i = 0; i < len; i++) {
            const cell = cells[i];
            const left = cell[0] == ":";;
            const right = cell[cell.length - 1] == ":";

            if (left && right)
                result.push(Alignment.Center);
            else if (right)
                result.push(Alignment.Right);
            else
                result.push(Alignment.Left);
        }

        return result;
    }
}