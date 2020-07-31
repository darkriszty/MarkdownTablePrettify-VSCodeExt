export class Range {
    constructor (
        private _startLine : number,
        private _endLine : number)
    { }

    public get startLine() : number {
        return this._startLine;
    }
    public get endLine() : number {
        return this._endLine;
    }
}
