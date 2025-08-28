export class RowViewModel {

    constructor (
        private readonly _values: string[],
        private readonly _displayWidhts: number[],
        private readonly _eol: string
    ) {
        if (_values == null) throw new Error("Parameter can't be null");
        if (_displayWidhts == null) throw new Error("Parameter can't be null");
        if (_values.length !== _displayWidhts.length) throw new Error("Values and display widths must have the same length.");
    }

    public get columnCount(): number { return this._values.length; }
    public get EOL(): string { return this._eol; }

    public getValueAt(index: number): string {
        const maxIndex = this._values.length - 1;
        if (index < 0 || index > maxIndex)
            throw new Error(`Argument out of range; should be between 0 and ${maxIndex}, but was ${index}.`);

        return this._values[index];
    }

    public getDisplayWidthAt(index: number): number {
        const maxIndex = this._displayWidhts.length - 1;
        if (index < 0 || index > maxIndex)
            throw new Error(`Argument out of range; should be between 0 and ${maxIndex}, but was ${index}.`);

        return this._displayWidhts[index];
    }
}