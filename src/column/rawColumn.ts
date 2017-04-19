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