export class Line {
    private readonly _value: string;
    private _eol: string;

    constructor(value: string) {
        this._value = value.replace(/\r?\n|\r/g, "");
        this._eol = value.substr(this._value.length);
    }

    public get value() : string {
        return this._value;
    }

    public get EOL() : string {
        return this._eol;
    }

    public set EOL(value: string) {
        this._eol = value;
    }
}
