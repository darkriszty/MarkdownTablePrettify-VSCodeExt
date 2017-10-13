import { Alignment } from "./alignment";
import { CellLengthCalculator } from "../cellLengthCalculator";

export class Table {
    private readonly _rowsWithSeparator: string[][];

    constructor(
        rowsWithSeparator: string[][],
        private _alignments: Alignment[])
    {
        if (rowsWithSeparator != null && rowsWithSeparator[0] != null && rowsWithSeparator[0].length != _alignments.length)
            throw new Error("The number of columns must match the number of alignments.");
        this._rowsWithSeparator = this.trimColumnValues(rowsWithSeparator);
    }

    public get rows(): string[][] { return this._rowsWithSeparator != null ? this._rowsWithSeparator.filter((v, i) => i != 1) : null; }
    public get separator(): string[] { return this._rowsWithSeparator[1]; }
    public get alignments(): Alignment[] { return this._alignments; }
    public get columnCount(): number { return this.rows[0].length; }
    public get rowCount(): number { return this.rows.length; }
    public get hasLeftBorder(): boolean { return this.isColumnEmpty(0); }
    public get hasRightBorder(): boolean { return this.isColumnEmpty(this.columnCount - 1); }

    public withoutEmptyColumns(): Table {
        return new Table(
            this.removeEmptyColumns(this.getEmptyFirstAndLastColumnIndexes()),
            this.alignmentsWithoutEmptyColumns(this.getEmptyFirstAndLastColumnIndexes())
        );
    }

    public isEmpty(): boolean {
        return this.rows == null || this.rows.length == 0;
    }

    public getLongestColumnLength(): number[] {
        let maxColLengths: number[] = new Array(this.columnCount).fill(0);

        for (let row = 0; row < this.rows.length; row++)
            for (let col = 0; col < this.rows[row].length; col++)
                maxColLengths[col] = Math.max(CellLengthCalculator.getLength(this.rows[row][col]), maxColLengths[col])

        return maxColLengths;
    }

    private removeEmptyColumns(emptyColumnIndexes: number[]): string[][] {
        let clonedRows = this._rowsWithSeparator.map(arr => arr.slice(0));
        for (let i = emptyColumnIndexes.length - 1; i >=0; i--)
            this.removeColumn(clonedRows, emptyColumnIndexes[i]);

        return clonedRows;
    }

    private alignmentsWithoutEmptyColumns(emptyColumnIndexes: number[]): Alignment[] {
        let result: Alignment[] = [];
        for (let i = 0; i < this._alignments.length; i++)
            if (emptyColumnIndexes.indexOf(i) == -1)
                result.push(this._alignments[i]);
        return result;
    }

    private getEmptyFirstAndLastColumnIndexes(): number[] {
        let emptyColumnIndexes: number[] = [];

        const colLength = this.rows[0].length;
        if (this.isColumnEmpty(0)) emptyColumnIndexes.push(0);
        if (this.isColumnEmpty(colLength - 1)) emptyColumnIndexes.push(colLength - 1);

        return emptyColumnIndexes;
    }

    private isColumnEmpty(column: number): boolean {
        for (let row = 0; row < this.rows.length; row++)
            if (this.rows[row][column].trim() != "")
                return false;
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