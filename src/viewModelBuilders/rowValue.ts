export class RowValue {
    private _value: string;
    private _maxColumnTextLength: number;

    constructor(maxColumnTextLength : number, value? : string) {
        if (value != null && value.length > maxColumnTextLength) 
            throw new Error("Invalid usage: the length of value cannot exceed maxColumnTextLength");

        this._value = value;
        this._maxColumnTextLength = maxColumnTextLength;
    }

    public get value(): string { return this._value; }
    public set value(v: string) { this._value = v; }
    public get maxColumnTextLength(): number { return this._maxColumnTextLength; }
    public set maxColumnTextLength(v: number) { this._maxColumnTextLength = v; }
}