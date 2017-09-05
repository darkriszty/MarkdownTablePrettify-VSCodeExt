import { Alignment } from "./alignment";

export class Table {

    constructor(
        private _rowsWithSeparator: string[][],
        private _alignments: Alignment[])
    {
        if (_rowsWithSeparator != null && _rowsWithSeparator[0] != null && _rowsWithSeparator[0].length != _alignments.length)
            throw new Error("The number of columns must match the number of alignments.");
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

    public trimValues(): Table {
        return new Table(this.trimColumnValues(), this._alignments);
    }

    public isEmpty(): boolean {
        return this.rows == null || this.rows.length == 0;
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

    private trimColumnValues(): string[][] {
        let result: string[][] = [];
        for (let i = 0; i < this._rowsWithSeparator.length; i++)
            result.push(this._rowsWithSeparator[i].map(r => r.trim()));
        return result;
    }
}