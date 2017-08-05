import { Table } from "../models/table";
import { TableValidator } from "./tableValidator";

export class TableFactory {

    constructor(
        private _validator: TableValidator)
    { }

    public getModel(text: string): Table {
        if (text == null)
            throw new Error("Can't create table model from null table text.");

        const rows = text.split(/\r\n|\r|\n/)
            .map(l => l.split("|"))
            .filter(arr => !(arr.length == 1 && /^\s*$/.test(arr[0])));

        const table = new Table(rows);
        if (!this._validator.isValid(table, true))
            throw new Error("Can't create table model from invalid text.");

        // remove the separator line from second line
        const rowsWithoutSeparator = rows.filter((v, i) => i != 1);
        return new Table(rowsWithoutSeparator);
    }
}