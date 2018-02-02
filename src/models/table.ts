import { Alignment } from "./alignment";
import { CellLengthCalculator } from "../cellLengthCalculator";

export class Table {
    private readonly _rowsWithSeparator: string[][];
    private _longestColumnLengths: number[] = null;

    constructor(
        rowsWithSeparator: string[][],
        private _alignments: Alignment[])
    {
        if (rowsWithSeparator != null && rowsWithSeparator[0] != null && rowsWithSeparator[0].length != _alignments.length)
            throw new Error("The number of columns must match the number of alignments.");

        this._rowsWithSeparator = this.trimColumnValues(rowsWithSeparator);
        this.setBorders();
        this.removeEmptyFirstAndLastColumns();
        this.setComplementaryBorders();
    }

    public get rows(): string[][] { return this._rowsWithSeparator != null ? this._rowsWithSeparator.filter((v, i) => i != 1) : null; }
    public get separator(): string[] { return this._rowsWithSeparator[1]; }
    public get alignments(): Alignment[] { return this._alignments; }
    public get columnCount(): number { return this.rows[0].length; }
    public get rowCount(): number { return this.rows.length; }
    public hasLeftBorder: boolean;
    public hasRightBorder: boolean;
    private get isFirstColumnEmpty(): boolean { return this.isColumnEmpty(0); }
    private get isLastColumnEmpty(): boolean { return this.isColumnEmpty(this.columnCount - 1); }

    private setBorders(): void {
        this.hasLeftBorder = this.isFirstColumnEmpty;
        this.hasRightBorder = this.isLastColumnEmpty;
    }

    private removeEmptyFirstAndLastColumns(): void {
        if (this.isFirstColumnEmpty) {
            this.removeColumn(this._rowsWithSeparator, 0);
            this._alignments.shift();
        }
        if (this.isLastColumnEmpty) {
            this.removeColumn(this._rowsWithSeparator, this.columnCount - 1);
            this._alignments.pop();
        }
    }

    private setComplementaryBorders(): void {
        if (this.hasLeftBorder && !this.hasRightBorder)
            this.hasRightBorder = true;
        if (this.hasRightBorder && !this.hasLeftBorder)
            this.hasRightBorder = false;
    }

    public isEmpty(): boolean {
        return this.rows == null || this.rows.length == 0;
    }

    public getLongestColumnLength(): number[] {
        if (this._longestColumnLengths == null) {
            let maxColLengths: number[] = new Array(this.columnCount).fill(0);

            for (let row = 0; row < this.rows.length; row++)
                for (let col = 0; col < this.rows[row].length; col++)
                    maxColLengths[col] = Math.max(CellLengthCalculator.getLength(this.rows[row][col]), maxColLengths[col])

            this._longestColumnLengths = maxColLengths;
        }
        return this._longestColumnLengths;
    }

    private isColumnEmpty(column: number): boolean {
        if (this.rows == null) return true;
        for (let row = 0; row < this.rows.length; row++) {
            const value = this.rows[row][column];
            if (value != null && value.trim() != "")
                return false;
        }
        return true;
    }

    private removeColumn(rows: string[][], column: number): void {
        for (let row = 0; row < rows.length; row++)
            rows[row].splice(column, 1);
    }

    private trimColumnValues(rows: string[][]): string[][] {
        if (rows == null) return null;
        let result: string[][] = [];
        for (let i = 0; i < rows.length; i++)
            result.push(rows[i].map(r => r.trim()));
        return result;
    }
}