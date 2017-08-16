export class Table {

    constructor(private _rows: string[][]) { }

    public get rows(): string[][] { return this._rows; }
    public get columnCount(): number { return this._rows[0].length; }
    public get rowCount(): number { return this._rows.length; }

    public withoutEmptyColumns(): Table {
        return new Table(this.removeEmptyColumns(this.getEmptyFirstAndLastColumnIndexes()));
    }

    public trimValues(): Table {
        return new Table(this.trimColumnValues());
    }

    public isEmpty(): boolean {
        return this._rows == null || this._rows.length == 0;
    }

    private removeEmptyColumns(emptyColumnIndexes: number[]): string[][] {
        let clonedRows = this._rows.map(arr => arr.slice(0));
        for (let i = emptyColumnIndexes.length - 1; i >=0; i--)
            this.removeColumn(clonedRows, emptyColumnIndexes[i]);

        return clonedRows;
    }

    private getEmptyFirstAndLastColumnIndexes(): number[] {
        let emptyColumnIndexes: number[] = [];

        const colLength = this._rows[0].length;
        if (this.isColumnEmpty(0)) emptyColumnIndexes.push(0);
        if (this.isColumnEmpty(colLength - 1)) emptyColumnIndexes.push(colLength - 1);

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

    private trimColumnValues(): string[][] {
        let result: string[][] = [];
        for (let i = 0; i < this._rows.length; i++)
            result.push(this._rows[i].map(r => r.trim()));
        return result;
    }
}