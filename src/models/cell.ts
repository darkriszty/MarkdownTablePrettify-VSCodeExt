export class Cell {
    private _value: string;
    private _length: number;

    constructor(value: string) {
        this._value = value;
        this._length = this._getOccupiedLength(value);
    }

    public static Empty = new Cell(" ");

    public getValue(): string {
        return this._value;
    }

    public getLength(): number {
        return this._length;
    }

    private _getOccupiedLength(value: string): number {
        let length: number = 0;

        for (let i = 0, n = value.length; i < n; i++)
            length += this._getCharDisplayLength(value.charAt(i));

        return length;
    }

    private _getCharDisplayLength(character: string): number {
        // for the specified ranges use a length of 2, otherwise a length of 1
        return /^(([\u{4E00}-\u{9FFF}])|([\u{3400}-\u{4DBF}])|([\u{20000}-\u{2A6DF}])|([\u{2A700}-\u{2B73F}])|([\u{2B740}-\u{2B81F}]))$/u.test(character)
            ? 2
            : 1;
    }
}