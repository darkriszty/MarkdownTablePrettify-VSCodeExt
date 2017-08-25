import { Table } from "../models/table";
import { TableValidator } from "./tableValidator";
import { AlignmentFactory } from "./alignmentFactory";
import { Alignment } from "../models/alignment";

export class TableFactory {

    constructor(
        private _validator: TableValidator,
        private _alignmentFactory: AlignmentFactory)
    { }

    public getModel(text: string): Table {
        if (text == null)
            throw new Error("Can't create table model from null table text.");

        const rows = text.split(/\r\n|\r|\n/)
            .map(l => l.split("|"))
            .filter(arr => !(arr.length == 1 && /^\s*$/.test(arr[0])));

        const alignments: Alignment[] = rows != null && rows.length > 1 
            ? this._alignmentFactory.createAlignments(rows[1]) 
            : [];
        const table = new Table(rows, alignments);
        if (!this._validator.isValid(table, true))
            throw new Error("Can't create table model from invalid text.");

        // remove the separator line from second line
        const rowsWithoutSeparator = rows.filter((v, i) => i != 1);
        return new Table(rowsWithoutSeparator, alignments);
    }
}