import { ColumnPositioning } from "./columnPositioning";
import { Cell } from "./cell";

export class Column {
    private _normalizedColumnValues: string[] = [];
    private _columnType: ColumnPositioning;
    private _columnLength: number = 0;

    constructor(private _cells: Cell[]) {
        this._setColumnLength();
    }

    public getNumberOfRows(): number {
        return this._cells.length + 1;
    }

    public isEmpty(): boolean {
        return this._columnLength == 0;
    }

    public getValue(row: number): string {
        return this._normalizedColumnValues[row];
    }

    public getPositioning(): ColumnPositioning {
        return this._columnType;
    }

    public setPositioning(position: ColumnPositioning): void {
        this._columnType = position;
        this._normalizeColumns();
    }

    private _normalizeColumns(): void {
        for (let row = 0, rowCount = this._cells.length ; row < rowCount; row++) {
            const currentRowValue = this.isEmpty() && this._columnType == ColumnPositioning.Middle
                ? Cell.Empty
                : this._cells[row];
            this._addValueWithPadding(currentRowValue, " ");
            if (row == 0)
                this._addValueWithPadding(new Cell("-"), "-");
        }
    }

    private _addValueWithPadding(cell: Cell, padChar: string): void {
        let newValue = "";
        const cellValue = cell.getValue();
        if (!this.isEmpty() || this._columnType == ColumnPositioning.Middle) {
            const left = this._getLeftPad(cellValue, padChar);
            const right = this._getRightPad(cell, padChar);

            newValue = left + cellValue + right;
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

    private _getRightPad(cell: Cell, rightPad: string): string {
        const seperatorBeingAdded = this._oneRowExists();
        // only the separator has padding in the last column
        if (this._columnType == ColumnPositioning.Last && !seperatorBeingAdded)
            return "";

        const extraPaddingCount = Math.max(this._columnLength - cell.getLength() + 2, 2);
        return new Array(extraPaddingCount).join(rightPad);
    }

    private _setColumnLength(): void {
        const rowCount = this._cells.length;
        for (let row = 0 ; row < rowCount; row++) {
            const currentLength = this._cells[row].getLength();
            if (currentLength > this._columnLength)
               this._columnLength = currentLength;
        }
    }

    private _oneRowExists(): boolean {
        return this._normalizedColumnValues.length == 1;
    }
}
