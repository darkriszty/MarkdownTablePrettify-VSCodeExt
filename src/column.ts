export class Column {
    private _normalizedColumnValues: string[] = [];

    constructor(
        private _rawColumn: RawColumn,
        private _columnType: ColumnPositioning) {
            this._normalizeColumns();
    }

    public getSize(): number {
        return this._normalizedColumnValues.length;
    }

    public isEmpty(): boolean {
        return this._rawColumn.isEmpty();
    }

    public getValue(row: number): string {
        return this._normalizedColumnValues[row];
    }

    public getPositioning(): ColumnPositioning {
        return this._columnType;
    }

    private _normalizeColumns(): void {
        for (let row = 0, rowCount = this._rawColumn.columnValues.length ; row < rowCount; row++) {
            const currentRowValue = this.isEmpty() && this._columnType == ColumnPositioning.Middle
                ? " " 
                : this._rawColumn.columnValues[row];
            this._addValueWithPadding(currentRowValue, " ");
            if (row == 0)
                this._addValueWithPadding("-", "-");
        }
    }

    private _addValueWithPadding(value: string, padChar: string): void {
        let newValue = "";
        if (!this.isEmpty() || this._columnType == ColumnPositioning.Middle) {
            const left = this._getLeftPad(value, padChar);
            const right = this._getRightPad(value, padChar);

            newValue = left + value + right;
        }
        this._normalizedColumnValues.push(newValue);
    }

    private _getLeftPad(value: string, padChar: string): string {
        switch (this._columnType) {
            // the first column doesn't need a left padding
            case ColumnPositioning.First:
                return "";
            case ColumnPositioning.Middle:
                return padChar;
            // the last column only has left padding if the value is not empty
            case ColumnPositioning.Last:
                return !!value && value.length > 0
                    ? padChar
                    : "";
        }
    }

    private _getRightPad(value: string, rightPad: string): string {
        const seperatorBeingAdded = this._oneRowExists();
        // only the separator has padding in the last column
        if (this._columnType == ColumnPositioning.Last && !seperatorBeingAdded)
            return "";

        const extraPaddingCount = Math.max(this._rawColumn.cellLength - value.length + 2, 2);
        return new Array(extraPaddingCount).join(rightPad);
    }

    private _oneRowExists(): boolean {
        return this._normalizedColumnValues.length == 1;
    }
}

export enum ColumnPositioning {
    Unkown,
    First,
    Middle,
    Last
}

export class ColumnFactory {
    public static *generateColumns(rawRows: string[][]): Iterable<Column> {
        const rowCount = rawRows.length;
        let colCount = rawRows[0].length;

        let rawColumns: RawColumn[] = [];

        // Create "raw" columns first to be able to specify the position (first/middle/last) of all columns later (based 
        // on maxLength) taking into account that columns can still be added or removed from the begginning/end.
        for (let col = 0; col < colCount; col++) {
            rawColumns.push(new RawColumn(rawRows.map(r => r[col])));
        }

        if (colCount > 1 && !rawColumns[0].isEmpty() && rawColumns[colCount - 1].isEmpty()) {
            // if the first column is not empty, but the last one is, then remove the last one
            rawColumns.splice(colCount - 1, 1);
            colCount--;
        } else if (colCount > 1 && rawColumns[0].isEmpty() && !rawColumns[colCount - 1].isEmpty()) {
            // add an empty column at the end if the first one is an empty column but the last one isn't
            const emptyRawRows = new Array(rowCount).fill(0);
            rawColumns.push(new RawColumn(emptyRawRows));
            colCount++;
        }

        // now that the types can be determined create the real columns
        for (let col = 0; col < colCount; col++) {
            const columnPositioning = col == 0
                ? ColumnPositioning.First
                : col == colCount - 1
                    ? ColumnPositioning.Last
                    : ColumnPositioning.Middle;
            yield new Column(rawColumns[col], columnPositioning);
        }
    }
}

export class RawColumn {
    public cellLength: number = 0;
    constructor(public columnValues: string[]) { 
        this._setCellLength();
    }

    isEmpty(): boolean {
        return this.cellLength == 0;
    }

    private _setCellLength(): void {
        // determine the expected maximum length of this column
        const rowCount = this.columnValues.length;
        for (let row = 0 ; row < rowCount; row++) {
            const currentLength = this.columnValues[row].length;
            if (currentLength > this.cellLength)
               this.cellLength = currentLength;
        }
    }
}