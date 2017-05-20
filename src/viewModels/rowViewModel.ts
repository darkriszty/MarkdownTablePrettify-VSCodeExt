export class RowViewModel {

    constructor (private _values: string[]) { }

    public getValueAt(index: number): string {
        const maxIndex = this._values.length - 1;
        if (index < 0 || index > maxIndex)
            throw new Error(`Argument out of range; should be between 0 and ${maxIndex}, but was ${index}.`);

        return this._values[index];
    }
}