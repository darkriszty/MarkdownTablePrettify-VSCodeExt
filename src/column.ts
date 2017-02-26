export class Column {
    private _columnValues: string[] = [];
    constructor(
        private _cellLengths: number,
        private _columnType: ColumnType) { }

    public getSize(): number {
        return this._columnValues.length;
    }

    public isEmpty(): boolean {
        return this._cellLengths == 0;
    }

    public getValue(row: number): string {
        return this._columnValues[row];
    }

    public getType(): ColumnType {
        return this._columnType;
    }

    public addValue(value: string): void {
        // empty columns shouldn't have values
        if (this.isEmpty())
            return;
        this._addValueWithPadding(value, " ");
        this._addSeparatorIfRequired();
    }

    private _addValueWithPadding(value: string, padChar: string): void {
        const left = this._getLeftPad(value, padChar);
        const right = this._getRightPad(value, padChar);

        const newValue = left + value + right;
        this._columnValues.push(newValue);
    }

    private _getLeftPad(value: string, padChar: string): string {
        switch (this._columnType) {
            // the first column doesn't need a left padding
            case ColumnType.First:
                return "";
            case ColumnType.Middle:
                return padChar;
            // the last column only has left padding if the value is not empty
            case ColumnType.Last:
                return !!value && value.length > 0
                    ? padChar
                    : "";
        }
    }

    private _getRightPad(value: string, rightPad: string): string {
        const seperatorBeingAdded = this._oneRowExists();
        if ((this._columnType == ColumnType.First) ||
            (this._columnType == ColumnType.Middle) ||
            (this._columnType == ColumnType.Last && seperatorBeingAdded)) 
        {
            const extraPaddingCount = this._cellLengths - value.length + 2;
            return new Array(extraPaddingCount).join(rightPad);
        }
        return "";
    }

    private _addSeparatorIfRequired(): void {
        if (this._oneRowExists())
            this._addValueWithPadding("-", "-");
    }

    private _oneRowExists(): boolean {
        return this._columnValues.length == 1;
    }
}

export enum ColumnType {
    First,
    Middle,
    Last
}