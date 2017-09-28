export class RowViewModelFactoryParam {

    constructor(
        private _maxTextLengthsPerColumn: number[],
        public tableHasLeftBorder: boolean,
        public tableHasRightBorder: boolean
    ) {
        if (_maxTextLengthsPerColumn == null)
            throw new Error("Can't build row without knowing the expected lengths.");
    }

    public get maxTextLengthsPerColumn(): number[] { return this._maxTextLengthsPerColumn; }
    public get numberOfColumns(): number { return this.maxTextLengthsPerColumn.length; }

    public static createFrom(other: RowViewModelFactoryParam): RowViewModelFactoryParam {
        let result = new RowViewModelFactoryParam(other._maxTextLengthsPerColumn, other.tableHasLeftBorder, other.tableHasRightBorder);
        result.rowValues = other.rowValues;
        return result;
    }

    public rowValues: string[];
}