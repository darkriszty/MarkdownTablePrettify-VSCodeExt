import { Alignment } from "./alignment";
import { CellLengthCalculator } from "../cellLengthCalculator";

export class Table {
    private readonly _rows: string[][];
    private _longestColumnLengths: number[] = null;

    constructor(
        rows: string[][],
        private _alignments: Alignment[])
    {
        if (rows != null && rows[0] != null && rows[0].length != _alignments.length)
            throw new Error("The number of columns must match the number of alignments.");

        this._rows = rows;
    }

    public get rows(): string[][] { return this._rows != null ? this._rows : null; }
    public get separator(): string[] { return this.hasRows ? this._rows[1] : []; }
    public get alignments(): Alignment[] { return this._alignments; }
    public get columnCount(): number { return this.hasRows ? this.rows[0].length : 0; }
    public get rowCount(): number { return this.hasRows ? this.rows.length : 0; }
    public hasLeftBorder: boolean = false;
    public hasRightBorder: boolean = false;

    private get hasRows(): boolean { return this.rows != null && this.rows.length > 0; }

    public isEmpty(): boolean {
        return !this.hasRows;
    }

    public getLongestColumnLengths(): number[] {
        if (!this.hasRows) return [];
        if (this._longestColumnLengths == null) {
            let maxColLengths: number[] = new Array(this.columnCount).fill(0);

            for (let row = 0; row < this.rows.length; row++)
                for (let col = 0; col < this.rows[row].length; col++)
                    maxColLengths[col] = Math.max(CellLengthCalculator.getLength(this.rows[row][col]), maxColLengths[col])

            this._longestColumnLengths = maxColLengths;
        }
        return this._longestColumnLengths;
    }
}