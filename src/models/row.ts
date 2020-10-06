import { Cell } from "./cell";

export class Row {
    constructor(
        private readonly _cells: Cell[],
        private readonly _eol: string)
    { }

    public get cells(): Cell[] { return this._cells; }
    public get EOL(): string { return this._eol; }
}