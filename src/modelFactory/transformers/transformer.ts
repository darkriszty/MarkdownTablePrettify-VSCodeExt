import { Table } from "../../models/table";

export abstract class Transformer {

    constructor (private _next: Transformer) { }

    protected abstract transform(input: Table): Table;

    public process(input: Table): Table {
        if (input == null || input.isEmpty())
            return input;

        let table = this.transform(input);
        if (this._next != null)
            table = this._next.process(table);

        return table;
    }
}