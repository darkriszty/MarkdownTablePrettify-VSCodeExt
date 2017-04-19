import { RawColumn } from "./rawColumn";
import { ColumnPositioning } from "./columnPositioning";

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
