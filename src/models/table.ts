import { Alignment } from "./alignment";
import { Row } from "./row";

export class Table {
    private readonly _rows: Row[];

    constructor(
        rows: Row[],
        private readonly _separatorEOL: string,
        private readonly _alignments: Alignment[],
        public readonly leftPad: string = "")
    {
        if (rows != null && rows[0] != null && rows[0].cells.length != _alignments.length)
            throw new Error("The number of columns must match the number of alignments.");

        this._rows = rows;
    }

    public get rows(): Row[] { return this._rows; }
    public get alignments(): Alignment[] { return this._alignments; }
    public get columnCount(): number { return this.hasRows ? this.rows[0].cells.length : 0; }
    public get rowCount(): number { return this.hasRows ? this.rows.length : 0; }
    public get separatorEOL(): string { return this._separatorEOL; }
    public hasLeftBorder: boolean = false;
    public hasRightBorder: boolean = false;

    private get hasRows(): boolean { return this.rows != null && this.rows.length > 0; }

    public isEmpty(): boolean {
        return !this.hasRows;
    }

    public getLongestColumnLengths(): number[] {
        if (!this.hasRows) return [];

        let maxColLengths: number[] = new Array(this.columnCount).fill(0);
        for (let row = 0; row < this.rows.length; row++)
            for (let col = 0; col < this.rows[row].cells.length; col++)
                maxColLengths[col] = Math.max(this.rows[row].cells[col].getLength(), maxColLengths[col]);

        return maxColLengths;
    }
}