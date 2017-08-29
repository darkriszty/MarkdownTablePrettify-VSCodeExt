import { Table } from "../models/table";
import { AlignmentFactory } from "./alignmentFactory";
import { Alignment } from "../models/alignment";

export class TableFactory {

    constructor(
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
        return new Table(rows, alignments);
    }
}