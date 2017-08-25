import { Alignment } from "./alignment";

export class Table {

    constructor(
        private _rows: string[][],
        private _alignments: Alignment[]) 
    {
        if (this._rows != null && this._rows[0].length != this._alignments.length)
            throw new Error("The number of rows must match the number of alignments");
    }

    public get rows(): string[][] { return this._rows; }
    public get alignments(): Alignment[] { return this._alignments; }
    public get columnCount(): number { return this._rows[0].length; }
    public get rowCount(): number { return this._rows.length; }

    public withoutEmptyColumns(): Table {
        return new Table(this.removeEmptyColumns(), this.alignmentsWithoutEmptyColumns());
    }

    public isEmpty(): boolean {
        return this._rows == null || this._rows.length == 0;
    }

    private removeEmptyColumns(): string[][] {
        let emptyColumnIndexes: number[] = this.getEmptyColumnIndexes();

        let clonedRows = this._rows.map(arr => arr.slice(0));
        for (let i = emptyColumnIndexes.length - 1; i >=0; i--)
            this.removeColumn(clonedRows, emptyColumnIndexes[i]);

        return clonedRows;
    }

    private alignmentsWithoutEmptyColumns(): Alignment[] {
        let emptyColumnIndexes: number[] = this.getEmptyColumnIndexes();
        let result: Alignment[] = [];
        for (let i = 0; i < this._rows[0].length; i++)
            if (emptyColumnIndexes.indexOf(i) != -1)
                result.push(this._alignments[i]);
        return result;
    }

    private getEmptyColumnIndexes(): number[] {
        let emptyColumnIndexes: number[] = [];
        const colLength = this._rows[0].length;
        for (let col = 0; col < colLength; col++)
            if (this.isColumnEmpty(col))
                emptyColumnIndexes.push(col);
        return emptyColumnIndexes;
    }

    private isColumnEmpty(column: number): boolean {
        for (let row = 0; row < this._rows.length; row++)
            if (this._rows[row][column].trim() != "")
                return false;
        return true;
    }

    private removeColumn(rows: string[][], column: number): void {
        for (let row = 0; row < rows.length; row++)
            rows[row].splice(column, 1);
    }
}