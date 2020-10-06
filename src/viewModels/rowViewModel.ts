export class RowViewModel {

    constructor (
        private readonly _values: string[],
        private readonly _eol: string
    ) { }

    public get columnCount(): number { return this._values.length; }
    public get EOL(): string { return this._eol; }

    public getValueAt(index: number): string {
        const maxIndex = this._values.length - 1;
        if (index < 0 || index > maxIndex)
            throw new Error(`Argument out of range; should be between 0 and ${maxIndex}, but was ${index}.`);

        return this._values[index];
    }
}